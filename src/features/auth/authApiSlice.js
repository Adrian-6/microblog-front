import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials, logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        sendLogout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
            }
        }),

        refresh: builder.mutation({
            query: () => ({
                url: '/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    const { accessToken, email } = data
                    dispatch(setCredentials({ accessToken, email }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),

        googleLogin: builder.mutation({
            query: codeFromGoogle => ({
                url: `http://localhost:3000/auth/google?code=${codeFromGoogle}&redirect_uri=http://localhost:5173/auth/google`,
                method: 'GET',
            })
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useGoogleLoginMutation
} = authApiSlice