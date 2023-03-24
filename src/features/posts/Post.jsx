import React from 'react'
import { useSelector } from 'react-redux'
import { selectPostById } from './postsApiSlice'
import { useParams } from 'react-router-dom'
import { useGetPostsQuery, useHandleRepostMutation } from './postsApiSlice'
import { selectCurrentUser } from "../auth/authSlice"
import { useHandlePostVoteMutation } from './postsApiSlice'
import TimeAgo from './TimeAgo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import UserPopUp from '../users/UserPopUp'
import { useEffect, useState } from 'react'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { selectUserByEmail } from '../users/usersApiSlice'

const Post = React.forwardRef(({ postId }, ref) => {

    const email = useSelector(state => selectCurrentUser(state))

    const [handlePostVote] = useHandlePostVoteMutation()

    const { id } = useParams()

    if (!postId) {
        postId = id
    }

    useGetPostsQuery()

    const [handleRepost] = useHandleRepostMutation({ email, postId })

    const [modal, setModal] = useState(false)
    const [liked, setLiked] = useState(false)
    const [shared, setShared] = useState(false)
    const [shareLocked, setShareLocked] = useState(false)
    const post = useSelector(state => selectPostById(state, postId))
    const postAuthor = useSelector(state => selectUserByEmail(state, post?.author))

    useEffect(() => {

        if (post?.upvotedBy?.find(user => user === email)) setLiked(true)
        if (post?.sharedBy?.find(user => user === email)) setShared(true)
        if (post?.author === email) setShareLocked(true)
    }, [post])

    const navigate = useNavigate()

    let content;

    if (post && postAuthor) {

        let postLiked = liked ? 'post-vote-liked' : ''
        let postShared = shareLocked ? 'post-share-locked' : shared ? 'post-shared' : 'post-share'

        let postLikeIcon = liked ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeart} />

        const handleVote = (e) => {
            e.preventDefault()
            handlePostVote({ postId, email })
            setLiked(!liked)
        }
        const repost = () => {
            if (!shareLocked) {
                handleRepost({ email, postId })
                setShared(!shared)
            }
        }

        const postRedirect = (e) => {
            if (e.target.className === 'post-body' || e.target.className === 'post-footer' || e.target.className === 'post-header' || e.target.className === 'post-header-left') {
                navigate(`/posts/${postId}/`)
            }
        }
        const isEdited = post.edited ? <span className="post-edit">Edited</span> : null

        const postBody = post.body?.length < 1500 ? post.body : `${post.body.substring(0, 1497)}...` //crops the size of long posts
        content = (
            <>
                <article className="post" onClick={(e) => postRedirect(e)} tabIndex="0">
                    <span className="post-header">
                        <div className="post-header-picture">
                            <div className="profile-picture">
                                <img className="profile-picture" src={postAuthor.profilePictureURL}
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = "https://cdn-icons-png.flaticon.com/512/166/166347.png?w=826&t=st=1679619593~exp=1679620193~hmac=f34a680fa3d7d06914e0740ef84f42370e0aa2e2b33c467a4a4d0392ec31250a";
                                    }}
                                    onClick={() => navigate(`/users/${post.author}/`)} alt="user profile picture"
                                />
                            </div>
                            <div className='post-header-left'>
                                {<TimeAgo timestamp={post.createdAt} />}
                                <div className="post-header-author">
                                    <div
                                        onMouseEnter={() => setModal(true)}
                                        onMouseLeave={() => setModal(false)}
                                    >
                                        {modal && (
                                            <UserPopUp email={post.author} />
                                        )}
                                        <a href={`/users/${post.author}/`} className="user-display-name">
                                            {postAuthor.username}
                                        </a>
                                    </div>
                                </div>
                                <a href={`/users/${post.author}/`} className="user-email">
                                    {`@${postAuthor.email}`}
                                </a>
                            </div>

                        </div>
                        <span className="post-header-title" onClick={(e) => postRedirect(e)}><a href={`/posts/${post.id}/`}>
                            {post.title}</a>
                        </span>
                    </span>

                    {ref ? <div ref={ref} className="post-body">{postBody}{isEdited}</div> : <div className="post-body">{postBody}{isEdited}</div>}
                    <span className="post-footer">
                        <span><a href={`/posts/${postId}#comment/`}><FontAwesomeIcon icon={faComment} /> {post.comments.length}</a> </span>
                        <span className="post-footer-vote"><button onClick={(e) => handleVote(e)} onMouseDown={e => e.preventDefault()} className={`${postLiked}`}> {postLikeIcon} {post.upvotes}
                        </button></span>
                        <span className={postShared}><button onClick={repost} onMouseDown={e => e.preventDefault()} disabled={shareLocked}><FontAwesomeIcon icon={faRetweet} /> {post.shares}</button></span>
                    </span>
                </article>

            </>
        )

    }
    return content

})
export default Post
