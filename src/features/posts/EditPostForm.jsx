import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import TextareaAutosize from 'react-textarea-autosize'
import { setPopupVisible } from "../../app/popup/popupSlice"
import { selectCurrentUser } from "../auth/authSlice"
import { useDeletePostMutation, useUpdatePostMutation } from "./postsApiSlice"

const EditPostForm = ({ post, trigger, setTrigger }) => {
  const dispatch = useDispatch()
  const [updatePost, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdatePostMutation()

  const [deletePost] = useDeletePostMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(post.title)
  const [body, setBody] = useState(post.body)
  const [popup, setPopup] = useState(false)

  const canSave = [title, body, body.length <= 8000, title.length <= 110].every(Boolean) && !isLoading

  const onTitleChanged = e => setTitle(e.target.value)
  const onBodyChanged = e => setBody(e.target.value)

  const email = useSelector(selectCurrentUser)

  const onSavePostClicked = async (e) => {
    e.preventDefault()
    setTrigger(false)
    await updatePost({ id: post.id, title, body, email })
      .then(
        dispatch(setPopupVisible({ isPopupVisible: true, popupText: "Post edited" }))
      )
  }


  const onDeletePostClicked = async () => {
    await deletePost({ id: post.id, email })
      .then(
        navigate(-1)
      )
      .then(
        dispatch(setPopupVisible({ isPopupVisible: true, popupText: "Post deleted" }))
      )

  }

  const content = (
    <>
      <div className="popup" onClick={(e) => e.target.className === 'popup' ? setTrigger(false) : null}>
        <form className="edit-post-form" onSubmit={onSavePostClicked}>
          <div>
            <span className="edit-post-header">
              <h2>Edit Post</h2>

              <button
                onClick={() => setPopup(true)}
                className="delete-post-button"
                type="button"
              >Delete Post
              </button>
              {popup ? (
                <div className="popup">
                  <div className="delete-post-popup">
                    <h2>Delete Post?</h2>
                    <p>This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you and All Posts page.</p>
                    <button
                      onClick={onDeletePostClicked}
                      className="delete-post-button"
                      type="button"
                    >Delete</button>
                    <button
                      onClick={() => setPopup(false)}
                      className="cancel-button cancel-delete-post-button"
                      type="button"
                    >Cancel</button>
                  </div>
                </div>
              ) : null}
            </span>
            <span className="post-header">
              <label htmlFor='title' className='label-hidden'>post title</label>
              <TextareaAutosize
                id="title"
                name="title"
                type="text"
                autoComplete="off"
                value={title}
                onChange={onTitleChanged}
                maxRows="2"

                placeholder="Title"
                className="post-form-title"

              />
            </span>
            <div className="post-body">
              <label htmlFor='body' className='label-hidden'>post body</label>
              <TextareaAutosize
                id="body"
                name="body"
                type="text"
                autoComplete="off"
                value={body}
                onChange={onBodyChanged}
                placeholder="Your Post"
                className="post-form-body"
              />
            </div>
          </div>
          <div className="form__action-buttons">
            <button
              onClick={() => setTrigger(false)}
              className="cancel-button"
              type="button"
            >Cancel</button>
            <button
              type="submit"
              className="save-post-button"
              title="Save"
              disabled={!canSave}
            >
              Save
            </button>

          </div>
          <p className="errmsg">{error?.data?.message}
            {body.length > 8000 ? 'Post exceeding length limit (8000 characters)'
              : title.length > 110 ? 'Ttile exceeding length limit (110 characters)'
                : null}
          </p>
        </form>
      </div>
    </>
  )


  return trigger ? content : null
}
export default EditPostForm