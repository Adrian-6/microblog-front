import { selectCurrentUser } from "../features/auth/authSlice"
import { useSelector } from "react-redux"
import Logout from "../features/auth/Logout"
import SearchBar from "../features/users/SearchBar"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"

const Header = () => {

    const [search, setSearch] = useState('');


    const currentUser = useSelector(state => selectCurrentUser(state))
    const [menuActive, setMenuActive] = useState(false)
    const handleOnClick = () => {
        setMenuActive(prev => !prev)
    }
    screen.orientation.onchange = () => {
        setMenuActive(false)
        setSearch("")
    }

    if (menuActive === true) {
        // Disable scroll
        document.body.style.overflow = "hidden";
    } else {
        // Enable scroll
        document.body.style.overflow = "auto";
    }

    return (
        <header className={menuActive ? 'mobile-navbar' : 'header'}>
            <div className="header-left">
                <a href={`/users/${currentUser}/`}>Profile</a>
                <a href="/feed/">Feed</a>
                <a href="/posts/">All Posts</a>
                <a href="/posts/new/" >New Post</a>
            </div>
            <div className="header-center">
                <SearchBar menuActive={menuActive} search={search} setSearch={setSearch} />
            </div>

            <div className="header-right">
                <Logout />
            </div>
            <div className="mobile-header">
                <button onClick={() => handleOnClick()} className="mobile-navbar-icon" name="menu">
                    {menuActive ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
                </button>
            </div>
        </header>
    )
}

export default Header