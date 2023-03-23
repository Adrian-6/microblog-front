import { useState, useEffect, useRef } from 'react'
import { useGetPostsPageQuery } from '../features/posts/postsApiSlice'

const useAllPosts = (page = 1) => {

    Storage.prototype.getObj = function (key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    window.onbeforeunload = function () {
        sessionStorage.clear();
    }

    const {
        data,
        isSuccess,
    } = useGetPostsPageQuery(page)

    const didComponentRun = useRef(false)
    const [postsResults, setPostsResults] = useState(sessionStorage.getObj("postsArray") || [])
    const [postsIsLoading, setPostsIsLoading] = useState(false)
    const [postsIsError, setPostsIsError] = useState(false)
    const [postsError, setPostsError] = useState({})
    const [numberOfPages, setNumberOfPages] = useState(sessionStorage.getObj("numberOfPages") || 1)


    useEffect(() => {

        setPostsIsLoading(true)
        setPostsIsError(false)
        setPostsError({})

        const controller = new AbortController()
        const { signal } = controller
        try {
            setPostsResults(data.posts.ids)
            setNumberOfPages(data.numberOfPages)
            const postsArray = [...data.posts.ids]
            sessionStorage.setItem("postsArray", JSON.stringify(postsArray));
            sessionStorage.setItem("numberOfPages", data.numberOfPages)
            setPostsIsLoading(false)
        }
        catch {
            (err => {
                setPostsIsLoading(false)
                if (signal.aborted) return
                setPostsIsError(true)
                setPostsError({ message: err.message })
            })
        }
        return () => controller.abort()

    }, [isSuccess])

    return { postsIsLoading, postsIsError, postsError, postsResults, numberOfPages }
}

export default useAllPosts