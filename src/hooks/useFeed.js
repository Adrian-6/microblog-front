import { useState, useEffect, useRef } from 'react'
import { useGetFeedMutation } from '../features/posts/postsApiSlice'


const useFeed = (email, page = 0) => {

    Storage.prototype.getObj = function (key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);

    }

    const didComponentRun = useRef(false)
    const [postsResults, setPostsResults] = useState(sessionStorage.getObj("feedArray") || [])
    const [postsIsLoading, setPostsIsLoading] = useState(false)
    const [postsIsError, setPostsIsError] = useState(false)
    const [postsError, setPostsError] = useState({})
    const [postsHasNextPage, setPostsHasNextPage] = useState(false)

    const [getFeed, {
        data: posts,
    }] = useGetFeedMutation({ email, page })

    const getPostsPage = async (email, page = 0, options = {}) => {
        const response = await getFeed({ email, page }, options)
        return response
    }
    useEffect(() => {
        //prevent useEffect from fetching data twice on initial render 
        if (didComponentRun.current === false) {

            didComponentRun.current = true
            return
        } else if (didComponentRun.current === true) {
            window.onbeforeunload = function () {
                sessionStorage.clear();
            }

            setPostsIsLoading(true)
            setPostsIsError(false)
            setPostsError({})

            const controller = new AbortController()
            const { signal } = controller
            getPostsPage(email, page, { signal })
                .then(data => {
                    setPostsResults(prev => [...new Set([...prev, ...data.data.ids])])
                    const postsArray = [...new Set([...postsResults, ...data.data.ids])]

                    sessionStorage.setItem("feedArray", JSON.stringify(postsArray));
                    setPostsHasNextPage(Boolean(data.data.ids.length))
                    setPostsIsLoading(false)
                })
                .catch(err => {
                    setPostsIsLoading(false)
                    if (signal.aborted) return
                    setPostsIsError(true)
                    setPostsError({ message: err.message })
                })
            return () => controller.abort()
        }

    }, [page])

    return { postsIsLoading, postsIsError, postsError, postsResults, postsHasNextPage }
}

export default useFeed