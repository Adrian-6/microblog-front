import { useGetUsersQuery } from "./usersApiSlice"
import { useState, useEffect } from "react";
import UserPopUp from "./UserPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

const SearchBar = ({ search, setSearch }) => {

    let {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    const [results, setResults] = useState([]);

    useEffect(() => {
        if (isSuccess)
            for (const [key, value] of Object.entries(users.entities)) {
                array.push(value)
            }
        if (search) {
            //if search value starts with '@' return only users emails
            if (search['0'] === '@' && search.length > 1) {
                const usersEmails = array.filter(user => ((user.email).toLowerCase()).includes(search.slice(1).toLowerCase()))
                setResults(usersEmails)
            } else {
                const usersEmails = array.filter(user => ((user.email).toLowerCase()).includes(search.toLowerCase()))
                const usersNicknames = array.filter(user => ((user.username).toLowerCase()).includes(search.toLowerCase()))
                users = [...new Set([...usersEmails, ...usersNicknames])]
                setResults(users)
            }
        } else {
            setResults([])
        }
    }, [search])

    let content;
    let array = []
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        const cancelIcon = search ? <FontAwesomeIcon icon={faXmark} onClick={() => setSearch("")} /> : null
        content = (
            <div className="users-list">
                <div className="users-list__searchbar">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        className="searchbox"
                        id="searchbox"
                        type="text"
                        role="searchbox"
                        placeholder="Search users"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoComplete="off"
                    />
                    {cancelIcon}
                </div>
                <div className="users-search-results">
                    {results.map((user, i) => {
                        return <UserPopUp email={user.email} key={i} />
                    })}
                </div>
            </div>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default SearchBar