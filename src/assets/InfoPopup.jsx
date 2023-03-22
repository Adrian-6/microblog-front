import { useEffect } from "react"
import { setPopupVisible, selectPopupState, selectPopupText } from "../app/popup/popupSlice"
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";

const InfoPopup = () => {

    const dispatch = useDispatch()
    let popupState = useSelector(state => selectPopupState(state))
    let popupText = useSelector(state => selectPopupText(state))

    //displays the popup for 3 seconds
    useEffect(() => {
        setTimeout(() => {
            dispatch(setPopupVisible({ isPopupVisible: false }))
        }, 3000)
    }, [popupState])

    let popupClass = popupState ? "info-popup" : "popup-hidden"

    return (
        <div className={popupClass}>{popupText}</div>
    )
}

export default InfoPopup

