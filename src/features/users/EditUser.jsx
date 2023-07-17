import { useParams } from 'react-router-dom'
import { useGetUserByEmailMutation } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import { useEffect } from 'react'
import { useState } from 'react'
import Loading from '../../assets/Loading'

const EditUser = () => {
    const [getUserByEmail, { isLoading }] = useGetUserByEmailMutation()

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