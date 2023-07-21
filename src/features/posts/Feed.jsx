import { useCallback, useRef, useState } from "react"
import { useSelector } from "react-redux"
import Loading from '../../assets/Loading'
import useFeed from "../../hooks/useFeed"
import { selectCurrentUser } from "../auth/authSlice"
import Post from "./Post"

const Feed = () => {

    const intObserver = useRef()
    const email = useSelector(selectCurrentUser)
    const [page, setPage] = useState(Number(sessionStorage.getItem("feedPage")) || 0)
    const {
        postsIsLoading,
        postsIsError,
        postsError,
        postsResults,
        postsHasNextPage,
    } = useFeed(email, page)

    const lastPostRef = useCallback(post => {
        if (postsIsLoading) return
        if (intObserver.current) intObserver.current.disconnect()
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && postsHasNextPage) {
                setPage(prev => prev + 1)
                const pageNum = page + 1
                sessionStorage.setItem("feedPage", pageNum);
            }
        })
        if (post) intObserver.current.observe(post)
    }, [postsIsLoading, postsHasNextPage])

    if (postsIsError) return <p>Error: {postsError.message}</p>

    let content = (
        postsResults.map((postId, i) => {
            if (postsResults.length === i + 1) {
                return <Post ref={lastPostRef} key={postId} postId={postId} />
            }
            return <Post key={postId} postId={postId} />
        })
    )
    return (
        <div className="feed">
            {content}
            {postsIsLoading && <Loading />}
        </div>
    )
}
export default Feed