import { Routes, Route } from "react-router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Reports from "./pages/Reports"
import Evidence from "./pages/Evidence"
import Users from "./pages/Users"
import AdminRoute from "./components/RoleRoute"

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Admin-only */}
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/evidences" element={<Evidence />} />
      </Route>
    </Routes>
  )
}

export default App
