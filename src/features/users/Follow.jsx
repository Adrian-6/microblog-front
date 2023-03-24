import React from 'react'
import { useSelector } from 'react-redux'
import { useFollowUserMutation } from './usersApiSlice'
import { selectCurrentUser } from '../auth/authSlice'
import { useEffect, useRef, useState } from 'react'
import { selectUserByEmail } from './usersApiSlice'

const Follow = ({ targetUserEmail }) => {
    const effectRan = useRef(false)

    const currentUser = useSelector(selectCurrentUser)
    const user = useSelector(state => selectUserByEmail(state, targetUserEmail))
    const [following, setFollowing] = useState(false)
    const [isCurrentUser, setIsCurrentUser] = useState(false)

    useEffect(() => {
        if (currentUser === targetUserEmail) return setIsCurrentUser(true)
        if (effectRan.current === false && user) {
            const isFollowing = user.followedBy?.find(nickname => nickname === currentUser)
            if (isFollowing) {
                setFollowing(true)
            } else {
                setFollowing(false)
            }
        }
    }, [])

    const [followUser, { isSuccess }] = useFollowUserMutation()
    const text = following ? "Following" : "Follow"

    const handleFollow = async () => {
        followUser({ currentUser, targetUserEmail }).unwrap()
            .then(setFollowing(prevFollowing => !prevFollowing))
    }
    const disabled = isCurrentUser ? true : false

    return (
        <div>
            <button disabled={disabled} onClick={() => {
                handleFollow()
            }} className="follow-button">{text}</button>
        </div>
    )
}

export default Follow