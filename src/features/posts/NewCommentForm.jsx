import { useState, useEffect } from "react"
import { useAddNewCommentMutation } from "./postsApiSlice"
import { selectCurrentUser } from "../auth/authSlice"
import { useSelector } from "react-redux"
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux'
import { setPopupVisible } from "../../app/popup/popupSlice"

const NewCommentForm = ({ postId }) => {

    const [addNewComment, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewCommentMutation()

    const email = useSelector(selectCurrentUser)
    const dispatch = useDispatch()

    const [text, setText] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setText('')
        }
    }, [isSuccess])

    const onTextChanged = e => setText(e.target.value)

    const canSave = text && !isLoading && text.length <= 2000

    const onSavePostClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewComment({ text, postId, email })
                .then(
                    dispatch(setPopupVisible({ isPopupVisible: true, popupText: "Comment added" }))
                )
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="comment-form" onSubmit={onSavePostClicked}>
                <label htmlFor='comment' className='label-hidden'>comment</label>
                <TextareaAutosize
                    id="comment"
                    name="text"
                    type="text"
                    className="comment-form-textarea"
                    placeholder="Your comment"
                    autoComplete="off"
                    value={text}
                    onChange={onTextChanged}
                    maxRows="20"
                />
                <div className="form__action-buttons">
                    <button
                        className="comment-form-button"
                        title="Save"
                        disabled={!canSave}
                    >Comment</button>
                </div>
                <p>{text.length > 2000 ? 'Comment exceeding length limit (2000 characters)' : null}</p>

            </form>
        </>
    )

    return content
}
export default NewCommentForm