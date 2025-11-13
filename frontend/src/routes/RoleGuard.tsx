import { ReactNode } from 'react'
import { useAuth } from '../features/auth/AuthContext'
import Alert from '../components/UI/Alert'

type Props = { roles: ("resident" | "staff" | "admin")[]; children: ReactNode }

export default function RoleGuard({ roles, children }: Props) {
  const { user } = useAuth()
  if (!user) return null
  if (!roles.includes(user.role)) {
    return (
      <div className="p-6">
        <Alert type="warning" title="Không đủ quyền truy cập">
          Bạn không có quyền truy cập trang này.
        </Alert>
      </div>
    )
  }
  return <>{children}</>
}
