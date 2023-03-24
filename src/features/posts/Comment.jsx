
import { useHandleCommentVoteMutation, useDeleteCommentMutation } from './postsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import TimeAgo from './TimeAgo'
import { useEffect, useState } from 'react'
import UserPopUp from '../users/UserPopUp'
import { setPopupVisible } from '../../app/popup/popupSlice'
import { useDispatch } from 'react-redux'
import { selectUserByEmail } from '../users/usersApiSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Comment = ({ postId, comment, email }) => {

    const { _id, author, date, upvotes, body, upvotedBy } = comment

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [liked, setLiked] = useState(false)
    const [modal, setModal] = useState(false)
    const [popup, setPopup] = useState(false)

    useEffect(() => {
        upvotedBy.find((email) => {
            setLiked(true)
        })
    }, [])
    let commentLiked = liked ? 'comment-vote-liked' : ''
    let commentLikeIcon = liked ? <FontAwesomeIcon icon={faHeartSolid} /> : <FontAwesomeIcon icon={faHeart} />
    const [handleCommentVote] = useHandleCommentVoteMutation()

    const [deleteComment] = useDeleteCommentMutation()
    const commentAuthor = useSelector(state => selectUserByEmail(state, author))

    const handleVote = () => {
        handleCommentVote({ commentId: _id, email, postId })
        setLiked(!liked)
    }
    const handleDelete = () => {
        deleteComment({ email, postId, commentId: _id })
        dispatch(setPopupVisible({ isPopupVisible: true, popupText: "Comment deleted" }))
    }

    return (
        <div className="comment" >
            <span className="comment-header">
                <div className="comment-header-picture">
                    <div className="profile-picture">
                        <img className="profile-picture" src={commentAuthor.profilePictureURL}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "https://cdn-icons-png.flaticon.com/512/166/166347.png?w=826&t=st=1679619593~exp=1679620193~hmac=f34a680fa3d7d06914e0740ef84f42370e0aa2e2b33c467a4a4d0392ec31250a";
                            }}
                            onClick={() => navigate(`/users/${author}/`)}
                            alt="user profile picture"
                        />
                    </div>
                    <div
                        onMouseEnter={() => setModal(true)}
                        onMouseLeave={() => setModal(false)}
                    >
                        {modal && (
                            <UserPopUp email={author} />
                        )}
                        <span className="comment-author"><a href={`/users/${author}/`}>{commentAuthor.username}</a></span>
                    </div>
                </div>
                <span className="comment-date">{<TimeAgo timestamp={date} />}</span>
            </span>
            <div className="comment-text">
                {body}
            </div>
            <span className="comment-footer">

                {
                    popup ? (
                        <div className="popup" onClick={(e) => e.target.className === 'popup' ? setPopup(false) : null}>
                            <div className="delete-post-popup">
                                <h2>Delete Comment?</h2>
                                <p>This can’t be undone and it will be removed from this post.</p>
                                <button onClick={handleDelete}
                                    className="delete-post-button">
                                    Delete
                                </button>
                                <button
                                    onClick={() => setPopup(false)}
                                    className="cancel-button cancel-delete-post-button"
                                    type="button"
                                >Cancel</button>
                            </div>
                        </div>
                    ) : null
                }

                {
                    author === email ? <button
                        onClick={() => setPopup(true)}
                        className="button-comment-delete"
                        type="button"
                    >Delete
                    </button> : ""
                }
                <button onClick={handleVote} className={`comment-vote ${commentLiked}`} >{commentLikeIcon} {upvotes}</button>
            </span>
        </div>
    )
}
export default Comment