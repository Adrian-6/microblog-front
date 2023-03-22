import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken)
    return (
        token
            ? <Outlet />
            : <Navigate to="/login" replace />
    )
}

export default RequireAuth