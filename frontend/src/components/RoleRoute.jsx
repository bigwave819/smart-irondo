import { Navigate, Outlet } from "react-router"
import { isAdminAuthenticated } from "./isValid"

const AdminRoute = () => {
  const isAdmin = isAdminAuthenticated()

  if (!isAdmin) {
    localStorage.clear()
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
