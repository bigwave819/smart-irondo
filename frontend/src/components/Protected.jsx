import { Navigate, Outlet } from "react-router"

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token")
    return token ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute