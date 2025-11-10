import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './components/Auth/LoginPage'

import ForgotPassword from './components/Auth/ForgotPassword'
import CreateEmployee from './components/Admin/CreateEmployee'
import Sidebar from './components/Layout/Sidebar'
import EmployeeList from './pages/Admin/EmployeeList'
import EmployeeArchive from './pages/Admin/EmployeeArchive'
import Payslips from './pages/Admin/Payslips'
import LeaveRequests from './pages/Leave/LeaveRequests'
import AttendanceList from './pages/Leave/AttendanceList'
import AdminAttendanceList from './pages/Admin/AttendenceList'
import LeavePolicies from './pages/Leave/LeavePolicies'
import JobOpenings from './pages/TalentAcquisition/JobOpenings'
import CandidatePipeline from './pages/TalentAcquisition/CandidatePipeline'
import Onboarding from './pages/TalentAcquisition/Onboarding'
import MonthlySummary from './pages/User/MonthlySummary'
import CalendarManagement from './pages/Leave/CalendarManagement'
import GeneralSettings from './pages/Admin/GeneralSettings'
import SalaryGeneration from './pages/Payroll/SalaryGeneration'
import ManageEmployeeSalary from './pages/Payroll/ManageEmployeeSalary'
import EmployeeProfile from './pages/User/EmployeeProfile'
import { AuthProvider } from './context/AuthContext'
import RoleRoute from './components/Auth/RoleRoute'
import Unauthorized from './components/Auth/Unauthorized'
import Header from './components/Layout/Header'

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/forgot';

  return (
    <>
      {!hideLayout && <Header />}
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: hideLayout ? 0 : 56 }}>
        {!hideLayout && <Sidebar />}
        <main style={{ flex: 1, marginLeft: hideLayout ? 0 : 260 }}>
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
            <Route path="/leave/requests" element={<LeaveRequests />} />
            <Route path="/admin/attendance" element={
              <RoleRoute allowedRoles={["admin","hr"]}>
                <AdminAttendanceList />
              </RoleRoute>
            } />
            <Route path="/leave/attendance" element={
              <RoleRoute allowedRoles={["employee","admin","hr"]}>
                <AttendanceList adminView={false} />
              </RoleRoute>
            } />
            <Route path="/leave/policies" element={<LeavePolicies />} />
            <Route path="/talent/jobs" element={
              <RoleRoute allowedRoles={["admin","hr"]}>
                <JobOpenings />
              </RoleRoute>
            } />
            <Route path="/talent/pipeline" element={
              <RoleRoute allowedRoles={["admin","hr"]}>
                <CandidatePipeline />
              </RoleRoute>
            } />
            <Route path="/talent/onboarding" element={
              <RoleRoute allowedRoles={["admin","hr"]}>
                <Onboarding />
              </RoleRoute>
            } />
            <Route path="/payroll/generate" element={
              <RoleRoute allowedRoles={["admin","hr"]}>
                <SalaryGeneration />
              </RoleRoute>
            } />
            <Route path="/payroll/manage" element={
              <RoleRoute allowedRoles={["admin","hr"]}>
                <ManageEmployeeSalary />
              </RoleRoute>
            } />
            <Route path="/employee/:id" element={
              <RoleRoute allowedRoles={["admin","hr","employee"]}>
                <EmployeeProfile />
              </RoleRoute>
            } />
            <Route path="/admin/settings" element={
              <RoleRoute allowedRoles={["admin"]}>
                <GeneralSettings />
              </RoleRoute>
            } />
            
            <Route path="/my/monthly-summary" element={
              <RoleRoute allowedRoles={["employee"]}>
                <MonthlySummary />
              </RoleRoute>
            } />
            <Route path="/admin/payslips" element={
              <RoleRoute allowedRoles={["admin","hr","employee"]}>
                <Payslips />
              </RoleRoute>
            } />
            <Route path="/leave/calendar" element={
              <RoleRoute allowedRoles={["admin", "hr"]}>
                <CalendarManagement />
              </RoleRoute>
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
