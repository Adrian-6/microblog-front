import { Outlet } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import Login from './Login'
import Loading from '../../assets/Loading'

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)
    const [trueSuccess, setTrueSuccess] = useState(false)
    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // use in react 18 Strict Mode
            const verifyRefreshToken = async () => {
                try {
                    const response = await refresh()
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }
            if (!token) verifyRefreshToken()
        }
        return () => effectRan.current = true
    }, [])

    let content
    if (isLoading) {
        content = <Loading />
    } else if (isError) {
        console.log(error)
        content = (
            <>
                <p className='errmsg'></p>
                <Login />
            </>
        )
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    }
    return content
}
export default PersistLogin