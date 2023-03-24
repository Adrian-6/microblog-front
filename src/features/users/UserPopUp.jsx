import Follow from './Follow'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserByEmail } from './usersApiSlice'
import { parseISO, formatDistanceToNow } from 'date-fns'

const UserPopUp = ({ email }) => {

    let regex = /android|iphone|kindle|ipad/i
    let isMobileDevice = regex.test(navigator.userAgent);

    const user = useSelector(state => selectUserByEmail(state, email))

    const navigate = useNavigate()

        const date = parseISO(user.dateCreated)
        const timePeriod = formatDistanceToNow(date)
        let content = isMobileDevice ? null : (
            <div className='user-profile-small'>
                <div className="user-info">

                    <img className="profile-picture profile-link" src={user.profilePictureURL}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "https://cdn-icons-png.flaticon.com/512/166/166347.png?w=826&t=st=1679619593~exp=1679620193~hmac=f34a680fa3d7d06914e0740ef84f42370e0aa2e2b33c467a4a4d0392ec31250a";
                        }}
                        onClick={() => navigate(`/users/${user.email}/`)}
                        alt="user profile picture"
                    />

                    <div className="name">
                        <span className="username profile-link"><a href={`/users/${user.email}/`}>{user.username}</a></span>
                        <span className="username-at"><a href={`/users/${user.email}/`}>@{user.email}</a></span>
                    </div>
                </div>
                <div className='user-profile-footer'>
                    <Follow targetUserEmail={user.email} />
                    <div className="stats">
                        <div className="follow-stats">
                            <span>follows: {user.follows?.length} </span>
                            <span>followed by: {user.followedBy?.length}</span>
                        </div>
                        <span>Joined {timePeriod} ago</span>
                    </div>
                </div>
            </div>
        )
        return content
    }



export default UserPopUp