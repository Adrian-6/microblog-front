import { useState, useEffect } from "react"
import { useAddNewPostMutation } from "./postsApiSlice"
import { useNavigate } from "react-router-dom"
import { selectCurrentUser } from "../auth/authSlice"
import { useSelector } from "react-redux"
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from "react-redux"
import { setPopupVisible } from "../../app/popup/popupSlice"

const NewPostForm2 = () => {

    const [addNewPost, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewPostMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const email = useSelector(selectCurrentUser)

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [response, setResponse] = useState('')

    useEffect(() => {
        if (isSuccess) {
            const newPostId = response.data.postId
            setTitle('')
            setBody('')
            navigate(`/posts/${newPostId}/`)
        }
    }, [response])

    const onTitleChanged = e => setTitle(e.target.value)
    const onBodyChanged = e => setBody(e.target.value)


    const canSave = [title, body, body.length <= 8000, title.length <= 110].every(Boolean) && !isLoading

    const onSavePostClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewPost({ title, body, email })
                .then(res => {
                    setResponse(res)
                    dispatch(setPopupVisible({ isPopupVisible: true, popupText: "Post added" }))
                })
        }
    }

    const content = (
        <form className="new-post-form" onSubmit={onSavePostClicked}>
            <div>
                <span className="post-header">
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
    )

    return content
}
export default NewPostForm2

