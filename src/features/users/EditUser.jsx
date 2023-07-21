import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../assets/Loading'
import EditUserForm from './EditUserForm'
import { useGetUserByEmailMutation } from './usersApiSlice'

const EditUser = () => {
    const [getUserByEmail] = useGetUserByEmailMutation()

    const { email } = useParams()
    const [user, setUser] = useState('')

    useEffect(() => {
        const res = getUserByEmail(email).unwrap()
            .then(res => setUser(res))
    }, [])

    const content = user ? <EditUserForm user={user} /> : <Loading />

    return content
}
export default EditUser