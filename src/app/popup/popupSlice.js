import { createSlice } from "@reduxjs/toolkit"

const popupSlice = createSlice({
    name: 'layout',
    initialState: { isPopupVisible: false, popupText: "" },
    reducers: {
        setPopupVisible: (state, action) => {
            const { isPopupVisible, popupText } = action.payload
            state.isPopupVisible = isPopupVisible
            state.popupText = popupText;
        }
    }
})

export const { setPopupVisible } = popupSlice.actions

export default popupSlice.reducer

export const selectPopupState = (state) => state.popup.isPopupVisible
export const selectPopupText = (state) => state.popup.popupText

