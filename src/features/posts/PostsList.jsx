import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loading from '../../assets/Loading'
import useAllPosts from '../../hooks/useAllPosts'
import NewPostForm from "./NewPostForm"
import PagesList from "./PagesList"
import Post from "./Post"

const PostsList = () => {
    let { page } = useParams()
    if (!page || page < 1) {
        page = 1
    } else {
        page = Number(page)
    };
    const {
        postsIsLoading,
        postsIsError,
        postsError,
        postsResults,
        numberOfPages,
    } = useAllPosts(page)

    const [pages, setPages] = useState(0)
    useEffect(() => {
        if (!postsIsLoading) {
            setPages(numberOfPages)
        }
    }, [postsIsLoading, numberOfPages])

    let content

    if (postsIsLoading) content = <Loading />

    if (postsIsError) {
        content = <p className="errmsg">{postsError?.data?.message}</p>
    }
    if (postsResults) {

        content = (
            postsResults.map((postId) => {
                return <Post key={postId} postId={postId} />
            })
        )
    }

    if (!postsIsLoading && pages) {
        return (

            <div className="feed">
                <NewPostForm />
                {content}
                <PagesList page={page} pages={pages} />
            </div>
        )
    }
}
export default PostsList