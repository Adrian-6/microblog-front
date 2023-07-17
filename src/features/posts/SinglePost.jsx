import { useSelector } from 'react-redux'
import { selectPostById } from './postsApiSlice'
import { useParams } from 'react-router-dom'
import { useGetPostsQuery, useHandleRepostMutation } from './postsApiSlice'
import NewCommentForm from './NewCommentForm'
import Comment from './Comment'
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
import EditPostForm from './EditPostForm'
import { selectUserByEmail } from '../users/usersApiSlice'
import Loading from '../../assets/Loading'

const Post = ({ postId, comments }) => {
    const [handlePostVote] = useHandlePostVoteMutation()

    const email = useSelector(selectCurrentUser)
    const [modal, setModal] = useState(false)
    const [trigger, setTrigger] = useState(false)

    const { id } = useParams()

    if (!postId) {
        postId = id
    }

    let {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery()

    const [handleRepost] = useHandleRepostMutation({ email, postId })

    const [liked, setLiked] = useState(false)
    const [shared, setShared] = useState(false)
    const [isAuthor, setIsAuthor] = useState(false)

    const post = useSelector(state => selectPostById(state, postId))
    const postAuthor = useSelector(state => selectUserByEmail(state, post?.author))

    useEffect(() => {
        if (isSuccess && post) {
            if (post?.upvotedBy?.find(user => user === email)) setLiked(true)
            if (post?.sharedBy?.find(user => user === email)) setShared(true)
            if (post.author === email) {
                setIsAuthor(true)
            }
        }
    }, [isSuccess, post])

    let content;

    if (isLoading) {
        content = <Loading />;
    } else if (isSuccess && post && postAuthor) {

        let postLiked = liked ? 'post-vote-liked' : ''
        let postShared = isAuthor ? 'post-share-locked' : shared ? 'post-shared' : 'post-share'

        let postLikeIcon = liked ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeart} />

        const handleVote = () => {
            handlePostVote({ postId, email })
            setLiked(!liked)
        }
        const repost = () => {
            if (!isAuthor) {
                handleRepost({ email, postId })
                setShared(!shared)
            }
        }

        content = (
            <div className="post single-post">
                <span className="post-header">
                    <div className="post-header-picture">

                        <div className="profile-picture">
                            <a href={`/users/${post.author}/`}><img className="profile-picture" src={postAuthor.profilePictureURL} alt="user profile picture"/></a>
                        </div>
                        <div className='post-header-left'>
                            {<TimeAgo timestamp={post.createdAt} dateFormat="formatted" />}

                            <div className="post-header-author">
                                <div
                                    onMouseEnter={() => setModal(true)}
                                    onMouseLeave={() => setModal(false)}
                                >
                                    {modal && (
                                        <UserPopUp email={post.author} />
                                    )}
                                    <a href={`/users/${post.author}/`}>
                                        {postAuthor.username}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </span>
                <span className="post-header-title">{post.title}</span>

                <div className="post-body">
                    {post.body}
                    {post.author === email ? (
                        <>
                            <div>
                                {(
                                    <EditPostForm post={post} trigger={trigger} setTrigger={setTrigger} />
                                )}
                            </div>

                            <span className="post-edit post-edit-button" onClick={() => setTrigger(prev => !prev)}>
                                Edit Post
                            </span>
                        </>
                    )
                        : post.edited ? <span className="post-edit">Edited</span> : null}
                </div>

                <span className="post-footer single-post-footer">
                    <span onClick={() => { document.getElementById("comment").focus() }} className="single-post-comment-button"> <FontAwesomeIcon icon={faComment} /> {post.comments.length}</span>
                    <span className="post-footer-vote"><button onClick={handleVote} onMouseDown={e => e.preventDefault()} className={`${postLiked}`}> {postLikeIcon} {post.upvotes}
                    </button></span>
                    <span className={postShared}>
                        <button name="share-button" onClick={repost} disabled={isAuthor} onMouseDown={e => e.preventDefault()}>
                            <FontAwesomeIcon icon={faRetweet} /> {post.shares}
                        </button>
                    </span>
                </span>
                <div className="post-comment-form">
                    <NewCommentForm postId={post.id} />
                </div>
                <div className="post-comments-list">
                    {post.comments.map(comment => (
                        <Comment comment={comment} postId={postId} email={email} key={comment._id} />
                    ))
                    }
                </div>
            </div>
        )

    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content

}
export default Post
