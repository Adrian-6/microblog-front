import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice';
import { useLoginMutation } from '../auth/authApiSlice';
import { useGoogleLoginMutation } from '../auth/authApiSlice';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

function Login() {
    const location = useLocation();
    const dispatch = useDispatch()
    let [googleLogin] = useGoogleLoginMutation()

    const socialLogin = async () => {
        try {
            const { search } = location
            const codeFromGoogle = search.slice(6) // to get the value of the code query param.
            try {
                let userData = await googleLogin(codeFromGoogle) // unwrap lets you use try/catch block
                dispatch(setCredentials(userData))
                window.location.replace('/posts/')
            } catch (err) {
                console.log(err)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const { pathname } = location;
    if (pathname === '/auth/google/') {
        // this ensures that the social login method is run only when the path is /auth/google
        socialLogin()
    } else {
        // the app continues with its normal logic

        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [errMsg, setErrMsg] = useState('')

        const [login] = useLoginMutation()


        useEffect(() => {
            setErrMsg('')
        }, [email, password])

        const handleSubmit = async (e) => {
            e.preventDefault()
            try {
                const userData = await login({ email, password }).unwrap() // unwrap lets you use try/catch block
                dispatch(setCredentials(userData))
                setEmail('')
                setPassword('')
                window.location.replace('/posts/');
            } catch (err) {
                console.log(err)
                if (!err?.status) {
                    setErrMsg('No server Response')
                } else if (err?.status === 400) {
                    setErrMsg('Missing username or password')
                } else if (err?.status === 429) {
                    setErrMsg('Too many login attempts. Please try again in 10 seconds')
                } else {
                    setErrMsg('Login failed')
                }
            }
        }

        const handleEmailInput = (e) => setEmail(e.target.value)
        const handlePasswordInput = (e) => setPassword(e.target.value)
        // const handleToggle = () => setPersist(prev => !prev)

        const queryParams = queryString.stringify({
            client_id: `${import.meta.env.VITE_CLIENT_ID}`, // It must correspond to what we declared earlier in the backend
            scope: 'profile email', // This is the user data you have access to, in our case its just the mail.
            redirect_uri: `${import.meta.env.VITE_BASE_URL}/auth/google/`, // This is the uri that will be redirected to if the user signs into his google account successfully
            auth_type: 'rerequest', // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
            display: 'popup', //It pops up the consent screen when the anchor tag is clicked
            response_type: 'code', // This tells Google to append code to the response which will be sent to the backend which exchange the code for a token
            access_type: 'offline'

        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`

        const content = (
            <section className='login-section'>
                <p className='errmsg'>{errMsg}</p>
                <form className='login-form' onSubmit={handleSubmit}>
                    <button type='button' className='login-form-button' onClick={() => window.location.href = url}>Continue with Google</button>
                    <span className='login-form-divider'><div className='line-through-div'></div>or<div className='line-through-div'></div></span>
                    <label htmlFor='email' className='label-hidden'>email</label>
                    <input type='text' placeholder='Email' id='email' value={email} onChange={handleEmailInput}></input>
                    <label htmlFor='password' className='label-hidden'>password</label>
                    <input type='password' id='password' placeholder='Password' value={password} onChange={handlePasswordInput} autoComplete="current-password" ></input>
                    <button type='submit' name='submit' className='login-form-button'>Login</button>
                </form>
                <span>Don't have an account yet? <a href='/register/'>Sign up</a></span>
            </section>
        )

        return content
    }
}

export default Login
