import { jwtDecode } from "jwt-decode"

export const isAdminAuthenticated = () => {
  try {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    if (!token || !user) return false
    if (user.role !== "admin") return false

    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    return decoded.exp > currentTime
  } catch {
    return false
  }
}
