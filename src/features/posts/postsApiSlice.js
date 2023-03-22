import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.createdAt === b.createdAt) ? 0 : a.createdAt ? -1 : 1
})

const initialState = postsAdapter.getInitialState()

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedPosts = responseData.map(post => {
                    post.id = post._id
                    return post
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Post', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Post', id }))
                    ]
                } else return [{ type: 'Post', id: 'LIST' }]
            }
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts/create',
                method: 'POST',
                body: {
                    ...initialPost,
                }
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'PATCH',
                body: {
                    ...initialPost,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id, email }) => ({
                url: `/posts`,
                method: 'DELETE',
                body: { id, email }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        getFeed: builder.mutation({
            query: ({ email, page }) => `/posts/feed/${email}/${page}`,
            transformResponse: responseData => {
                const loadedPosts = responseData.map(post => {
                    post.id = post._id
                    return post
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            }
        }),
        getPostsPage: builder.query({
            query: (page) => `/posts/${page}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedPosts = responseData.posts.map(post => {
                    post.id = post._id
                    return post
                });
                const posts = postsAdapter.setAll(initialState, loadedPosts)
                const numberOfPages = responseData.pages
                return { posts, numberOfPages }
            },
            providesTags: (result, error, arg) => {
                if (result?.posts?.ids) {
                    return [
                        { type: 'Post', id: 'LIST' },
                        ...result.posts.ids.map(id => ({ type: 'Post', id }))
                    ]
                } else return [{ type: 'Post', id: 'LIST' }]
            }
        }),
        handleRepost: builder.mutation({
            query: ({ postId, email }) => ({
                url: '/posts/repost',
                method: 'POST',
                body: {
                    email,
                    postId
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        addNewComment: builder.mutation({
            query: ({ text, email, postId }) => ({
                url: '/posts/comment',
                method: 'POST',
                body: {
                    email,
                    postId,
                    text
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deleteComment: builder.mutation({
            query: ({ email, commentId, postId }) => ({
                url: '/posts/comment',
                method: 'DELETE',
                body: {
                    email,
                    commentId,
                    postId
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        handleCommentVote: builder.mutation({
            query: ({ email, commentId, postId }) => ({
                url: '/posts/comment/vote',
                method: 'POST',
                body: {
                    email,
                    commentId,
                    postId
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        handlePostVote: builder.mutation({
            query: ({ email, postId }) => ({
                url: '/posts/vote',
                method: 'POST',
                body: {
                    postId,
                    email
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
    })
})

export const {
    useGetPostsQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useGetFeedMutation,
    useGetPostsPageQuery,
    useHandleRepostMutation,
    useAddNewCommentMutation,
    useHandleCommentVoteMutation,
    useHandlePostVoteMutation,
    useDeleteCommentMutation
} = postsApiSlice

// returns the query result object
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select()

// creates memoized selector
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)