import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectPostById } from './postsApiSlice'
import EditPostForm from './EditPostForm'
import Loading from '../../assets/Loading'

const EditPost = () => {

    const { id } = useParams()

    const post = useSelector(state => selectPostById(state, id))

    const content = post ? <EditPostForm post={post} /> : <Loading />

    return content
}
export default EditPost