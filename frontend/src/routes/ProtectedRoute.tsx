import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import Spinner from '../components/UI/Spinner'

type Props = { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="p-8"><Spinner label="Đang kiểm tra phiên đăng nhập" /></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <>{children}</>
}
