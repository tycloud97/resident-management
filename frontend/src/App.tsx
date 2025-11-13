import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import PublicLayout from './components/Layout/PublicLayout'
import LoginPage from './features/auth/LoginPage'
import DashboardPage from './features/dashboard/DashboardPage'
import ResidentsList from './features/residents/ResidentsList'
import ResidentForm from './features/residents/ResidentForm'
import ResidentDetail from './features/residents/ResidentDetail'
import ComplaintForm from './features/complaints/ComplaintForm'
import ComplaintList from './features/complaints/ComplaintList'
import ComplaintDetail from './features/complaints/ComplaintDetail'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleGuard from './routes/RoleGuard'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Public area: accessible without login */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="complaints/new" element={<ComplaintForm />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
      </Route>

      {/* Management area: requires login and roles */}
      <Route
        path="/manage"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/manage/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="residents"
          element={
            <RoleGuard roles={["staff", "admin"]}>
              <ResidentsList />
            </RoleGuard>
          }
        />
        <Route
          path="residents/new"
          element={
            <RoleGuard roles={["staff", "admin"]}>
              <ResidentForm />
            </RoleGuard>
          }
        />
        <Route
          path="residents/:id"
          element={
            <RoleGuard roles={["staff", "admin"]}>
              <ResidentDetail />
            </RoleGuard>
          }
        />
        <Route
          path="complaints"
          element={
            <RoleGuard roles={["staff", "admin"]}>
              <ComplaintList />
            </RoleGuard>
          }
        />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
