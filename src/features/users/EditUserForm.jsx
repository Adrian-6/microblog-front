import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation, selectUserByEmail } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import { selectCurrentUser } from "../auth/authSlice"
import { useDispatch } from 'react-redux'
import { setPopupVisible } from "../../app/popup/popupSlice"

const USER_REGEX = /^(?=[A-Za-z0-9\s]{1,24}[A-Za-z0-9]?$)[A-Za-z0-9\s]{1,25}$/
const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]|\\:;"'<,>.?/]{4,26}$/
const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

const EditUserForm = ({ user, trigger, setTrigger }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [profilePic, setProfilePic] = useState(user.profilePictureURL)
    const [validProfilePic, setValidProfilePic] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [popup, setPopup] = useState(false)


    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidProfilePic(URL_REGEX.test(profilePic))
    }, [profilePic])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setTrigger(false)
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onProfilePicUrlChanged = e => setProfilePic(e.target.value)

    const currentUser = useSelector(selectCurrentUser)

    const onDeleteUserClicked = async (e) => {
        e.preventDefault()
        await deleteUser({ id: user.id, email: currentUser })
        navigate('/login/')
    }


    const displayPopup = () => dispatch(setPopupVisible({ isPopupVisible: true, popupText: "User edited" }))

    let canSave
    if (password) {
        canSave = [validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (password) {
            await updateUser({ id: user.id, username, profilePictureURL: profilePic, password, email: currentUser })
                .then(displayPopup)
        } else {
            await updateUser({ id: user.id, username, profilePictureURL: profilePic, email: currentUser })
                .then(displayPopup)
        }
    }

    const content = (
        <>
            <div className="popup" onClick={(e) => e.target.className === 'popup' ? setTrigger(false) : null}>
                <form className="edit-post-form edit-user-form" onSubmit={onSaveUserClicked}>
                    <span className="edit-post-header">
                        <h2>Edit User</h2>

                        <button
                            onClick={() => setPopup(true)}
                            className="delete-post-button"
                            type="button"
                        >Delete Account
                        </button>
                        {popup ? (
                            <div className="popup">
                                <div className="delete-post-popup">
                                    <h2>Delete Account?</h2>
                                    <p>This can’t be undone and you won’t be able to restore your account.</p>
                                    <button
                                        onClick={onDeleteUserClicked}
                                        className="delete-post-button"
                                        type="button"
                                    >Delete Account</button>
                                    <button
                                        onClick={() => setPopup(false)}
                                        className="cancel-button cancel-delete-post-button"
                                        type="button"
                                    >Cancel</button>
                                </div>
                            </div>
                        ) : null}
                    </span>
                    <span className="user-nickname">
                        <label htmlFor="nickname">Nickname</label>
                        <input
                            id="nickname"
                            name="nickname"
                            type="text"
                            autoComplete="off"
                            value={username}
                            onChange={onUsernameChanged}
                            placeholder="Nickname"
                            className="user-form-nickname"

                        />
                    </span>
                    <span className="user-profile-picture">
                        <label htmlFor="profile-picture">Profile Picture URL</label>
                        <input
                            id="profilePicture"
                            name="profilePicture"
                            type="text"
                            autoComplete="off"
                            value={profilePic}
                            onChange={onProfilePicUrlChanged}
                            placeholder="Link your profile picture"
                            className="user-form-profile-picture"

                        />
                    </span>
                    <span className="user-password">
                        <label htmlFor="password">New Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={onPasswordChanged}
                            placeholder="Password"
                            className="user-form-password"

                        />
                    </span>
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
                    <p className={errClass}>{error?.data?.message}
                        {!validUsername ? 'Invalid username!'
                            : !validPassword && password ? 'Invalid password!'
                                : !validProfilePic ? 'Invalid profile picture link!'
                                    : null}
                    </p>
                </form>

            </div>
        </>
    )

    return trigger ? content : null

}
export default EditUserForm
