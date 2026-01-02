import { Route, Routes } from 'react-router'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Evidence from './pages/Evidence'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/reports' element={<Reports />} />
      <Route path='/evidences' element={<Evidence />} />
    </Routes>
  )
}

export default App
