import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Loading from '../../assets/Loading'
import EditPostForm from './EditPostForm'
import { selectPostById } from './postsApiSlice'

const EditPost = () => {

    const { id } = useParams()

    const post = useSelector(state => selectPostById(state, id))

    const content = post ? <EditPostForm post={post} /> : <Loading />

    return content
}
export default EditPost