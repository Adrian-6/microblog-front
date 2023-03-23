import { selectCurrentUser } from "../auth/authSlice"
import Post from "./Post"
import { useSelector } from "react-redux"
import { useState, useRef, useCallback } from "react"
import useFeed from "../../hooks/useFeed"

const Feed = () => {
    const email = useSelector(selectCurrentUser)

    const [page, setPage] = useState(Number(sessionStorage.getItem("feedPage")) || 0)
    const {
        postsIsLoading,
        postsIsError,
        postsError,
        postsResults,
        postsHasNextPage,
    } = useFeed(email, page)

    const intObserver = useRef()

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
            {postsIsLoading && <p>Loading...</p>}
        </div>
    )
}
export default Feed