import { useSendLogoutMutation } from './authApiSlice'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    const [logout] = useSendLogoutMutation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    const content = (
        <button type="button" className="logout-button" onClick={handleLogout}>Logout</button>
    )
    return (
        content
    )
}
export default Logout