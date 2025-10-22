import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/Auth/LoginPage'
// Signup page removed — signup flows handled by admin create employee
import ForgotPassword from './components/Auth/ForgotPassword'
import CreateEmployee from './components/Admin/CreateEmployee'
import Sidebar from './components/Layout/Sidebar'
import EmployeeList from './pages/Admin/EmployeeList'
import EmployeeArchive from './pages/Admin/EmployeeArchive'
import Payslips from './pages/Admin/Payslips'
import { AuthProvider } from './context/AuthContext'
import RoleRoute from './components/Auth/RoleRoute'
import Unauthorized from './components/Auth/Unauthorized'
import Header from './components/Layout/Header'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <div style={{display:'flex', minHeight:'calc(100vh - 56px)'}}>
          <Sidebar />
          <main style={{flex:1}}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/admin/create-employee" element={
                <RoleRoute allowedRoles={["admin"]}>
                  <CreateEmployee />
                </RoleRoute>
              } />
              <Route path="/admin/employees" element={
                <RoleRoute allowedRoles={["admin","hr"]}>
                  <EmployeeList />
                </RoleRoute>
              } />
              <Route path="/admin/archive" element={
                <RoleRoute allowedRoles={["admin","hr"]}>
                  <EmployeeArchive />
                </RoleRoute>
              } />
              <Route path="/admin/payslips" element={
                <RoleRoute allowedRoles={["admin","hr","employee"]}>
                  <Payslips />
                </RoleRoute>
              } />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
