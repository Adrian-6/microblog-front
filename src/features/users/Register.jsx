import axios from 'axios';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

const Register = () => {

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(true)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const USER_REGEX = /^(?=[A-Za-z0-9\s]{1,24}[A-Za-z0-9]?$)[A-Za-z0-9\s]{1,25}$/
    const EMAIL_REGEX = /^[A-Za-z0-9]{1,25}$/
    const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]|\\:;"'<,>.?/]{4,26}$/

    useEffect(() => {
        if (email) setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setErrMsg('')
    }, [email, password, username])

    const canRegister = [validUsername, validPassword, validEmail].every(Boolean)

    const onSubmit = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
                email: email,
                password: password,
                username: username
            }, {
                headers: {
                    'content-type': 'application/json'
                }
            }).then((response) => {
                if (response.status === 201) {
                    window.location.assign('/posts/')
                } else { console.log(response.status) }
            })
        }
        catch (err) {
            console.log(err)
            if (!err?.response) {
                setErrMsg('No server Response')
            } else if (err?.response.status === 409) {
                setErrMsg('Username taken')
            } else if (err?.response.status === 429) {
                setErrMsg('Too many login attempts. Please try again in 10 seconds')

            } else {
                setErrMsg('Login failed')
            }
        }
    }

    const queryParams = queryString.stringify({
        client_id: `${import.meta.env.VITE_CLIENT_ID}`, // It must correspond to what we declared earlier in the backend
        scope: "profile email", // This is the user data you have access to, in our case its just the mail.
        redirect_uri: `${import.meta.env.VITE_BASE_URL}/auth/google/`, // This is the uri that will be redirected to if the user signs into his google account successfully
        auth_type: "rerequest", // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
        display: "popup", //It pops up the consent screen when the anchor tag is clicked
        response_type: "code", // This tells Google to append code to the response which will be sent to the backend which exchange the code for a token
        access_type: 'offline'

    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`

    return (
        <section className="login-section">
            <form className="login-form"
                onSubmit={async (e) => {
                    e.preventDefault()
                    await onSubmit()
                }}>
                <p className='errmsg'>
                    {
                        !validEmail ? 'Invalid email'
                            : username && !validUsername ? 'Invalid username'
                                : password && !validPassword ? 'Invalid password'
                                    : null
                    }
                    <p className={errMsg ? "errmsg" : "null"}>{errMsg}</p>
                </p>
                <button type='button' className="login-form-button" onClick={() => window.location.href = url}>Continue with Google</button>
                <span className="login-form-divider"><div className="line-through-div"></div>or<div className="line-through-div"></div></span>
                <label htmlFor='email' className='label-hidden'>email</label>
                <input id="email" type="text" placeholder="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor='password' className='label-hidden'>password</label>
                <input id="password" type='password' placeholder="password" name="password" value={password} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor='nickname' className='label-hidden'>nickname</label>
                <input id="nickname" type="text" placeholder="display name" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <button type='submit' className="login-form-button" disabled={!canRegister}
                >Sign up</button>
            </form>
        </section>
    )
}
export default Register
