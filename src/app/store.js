import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from '../features/auth/authSlice'
import popupReducer from '../app/popup/popupSlice'
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        popup: popupReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: false
})

setupListeners(store.dispatch)