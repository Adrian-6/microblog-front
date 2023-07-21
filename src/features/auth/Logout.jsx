import { useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from './authApiSlice'

const Logout = () => {
    const navigate = useNavigate()
    const [logout] = useSendLogoutMutation()

    const handleLogout = () => {
        logout()
        navigate('/login/')
    }
    const content = (
        <button type="button" className="logout-button" onClick={handleLogout}>Log Out</button>
    )
    return (
        content
    )
}
export default Logout
