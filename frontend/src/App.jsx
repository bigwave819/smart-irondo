import { Routes, Route } from 'react-router';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Evidence from './pages/Evidence';
import PrivateRoute from './components/Protected';
import Users from './pages/Users';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/evidences" element={<Evidence />} />
      </Route>
    </Routes>
  );
}

export default App;
