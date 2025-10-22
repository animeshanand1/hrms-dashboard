import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/Auth/LoginPage'
// Signup page removed — signup flows handled by admin create employee
import ForgotPassword from './components/Auth/ForgotPassword'
import CreateEmployee from './components/Admin/CreateEmployee'
import { AuthProvider } from './context/AuthContext'
import RoleRoute from './components/Auth/RoleRoute'
import Unauthorized from './components/Auth/Unauthorized'
import Header from './components/Layout/Header'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/admin/create-employee" element={
            <RoleRoute allowedRoles={["admin"]}>
              <CreateEmployee />
            </RoleRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
