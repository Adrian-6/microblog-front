import UserPopUp from "./UserPopUp"

const UsersList = ({ users = [], followListTrigger, setFollowListTrigger }) => {
    const content = users.length === 0 ?
        <div className="popup" onClick={(e) => e.target.className === 'popup' ? setFollowListTrigger(false) : null}>
            <div className="user-follows-list user-follows-list-empty">
                <p>No users to display</p>
            </div>
        </div>
        :
        (
            <div className="popup" onClick={(e) => e.target.className === 'popup' ? setFollowListTrigger(false) : null}>
                <div className="users-search-results user-follows-list ">
                    {users.map((user) => (
                        <UserPopUp email={user} key={user} />
                    ))}
                </div>
            </div>
        )

    return followListTrigger ? content : null
}

export default UsersList