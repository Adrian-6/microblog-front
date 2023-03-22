import { Outlet } from "react-router-dom";
import Header from "./Header";
import InfoPopup from "./InfoPopup";
import { useEffect } from "react";
import { setPopupVisible, selectPopupState } from "../app/popup/popupSlice"
import { useSelector } from "react-redux";

const Layout = () => {

    let popupState = useSelector(state => selectPopupState(state))

    return (

        <div className="layout">
            <Header />
            <Outlet />
            <InfoPopup text={'Post added'} />

        </div>

    )
}

export default Layout