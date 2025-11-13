import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

const navItem = (to: string, label: string) => (
  <NavLink
    to={to}
    className={({ isActive }) => `px-4 py-3 rounded-lg text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-800'}`}
  >
    {label}
  </NavLink>
)

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-container grid grid-rows-[auto,1fr] bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold">Khu vực quản trị</span>
            <nav aria-label="Điều hướng quản trị" className="flex gap-2">
              {navItem('/manage/dashboard', 'Bảng điều khiển')}
              {navItem('/manage/residents', 'Cư dân')}
              {navItem('/manage/complaints', 'Phản ánh')}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base text-gray-700">{user?.name} · {user?.role}</span>
            <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm">Đăng xuất</button>
          </div>
        </div>
      </header>
      <main id="main" className="max-w-7xl mx-auto w-full p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
