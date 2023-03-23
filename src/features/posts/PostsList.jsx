import Post from "./Post"
import NewPostForm from "./NewPostForm"
import useAllPosts from '../../hooks/useAllPosts'
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import PagesList from "./PagesList"

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

    const [pages, setPages] = useState(1)
    useEffect(() => {
        if (!postsIsLoading) {
            setPages(numberOfPages)
        }

    }, [postsIsLoading, numberOfPages])

    let content

    if (postsIsLoading) content = <p>Loading...</p>

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

    if (!postsIsLoading) {
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