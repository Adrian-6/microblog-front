import { useParams } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import Follow from './Follow'
import { useState } from 'react'
import Post from '../posts/Post'
import { selectCurrentUser } from '../auth/authSlice'
import { selectUserByEmail } from './usersApiSlice'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from "@fortawesome/free-solid-svg-icons"
import EditUserForm from './EditUserForm'
import { parseISO, format } from 'date-fns'
import UsersList from './UsersList'

const User = () => {
    const { email } = useParams()
    const user = useSelector(state => selectUserByEmail(state, email))
    const currentUser = useSelector(selectCurrentUser)

    const [trigger, setTrigger] = useState(false)
    const [followListTrigger, setFollowListTrigger] = useState(false)
    const [followList, setFollowList] = useState([])

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let posts

    if (isLoading) posts = <p>Loading...</p>

    if (isError) {
        posts = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess && user) {

        const date = parseISO(user.dateCreated)
        const formatted = format(date, 'dd/MM/yyyy')

        const { userPostsId } = user
        posts = (
            userPostsId?.length
                ? userPostsId.map(postId => <Post key={postId} postId={postId} />)
                : 'No posts'
        )

        return (
            <div className='user-profile'>
                <div className="user-profile-background">

                    {/* <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" height="300px" width="300px" className="profile-picture" /> */}
                    <div><img src={user.profilePictureURL} height="400px" width="400px" className="profile-picture profile-picture-xl" alt="user profile picture" />
                    </div>
                    <div className="user-profile-info">
                        <div className="user-upper-row">
                            <span className="username"> {user.username}</span>
                            <span>@{user.email}</span>

                        </div>
                        {email === currentUser ? (
                            <>
                                <div>
                                    {(
                                        <EditUserForm user={user} trigger={trigger} setTrigger={setTrigger} />
                                    )}
                                </div>



                                <span className="post-edit post-edit-button edit-user-icon" onClick={() => setTrigger(prev => !prev)}>
                                    <FontAwesomeIcon icon={faGear} />
                                </span>
                            </>
                        ) :
                            <Follow targetUserEmail={email} />
                        }
                        <div className="user-bottom-row">
                            <button onClick={() => {
                                setFollowListTrigger(prev => !prev)
                                setFollowList(user.follows)
                            }}>Following: {user.follows?.length}</button>
                            <button onClick={() => {
                                setFollowListTrigger(prev => !prev)
                                setFollowList(user.followedBy)
                            }}>Followers: {user.followedBy?.length}</button>
                            <div>Joined: {formatted}</div>
                        </div>
                    </div>
                </div>
                <UsersList users={followList} followListTrigger={followListTrigger} setFollowListTrigger={setFollowListTrigger} />
                <div className="feed">
                    {posts}
                </div>
            </div>
        )
    }
}
export default User
