import type { ReactNode } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import Logo from './Logo'

const navItem = (to: string, label: string, icon: ReactNode) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-lg text-sm md:text-base font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 ${
        isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-800'
      }`
    }
  >
    <span className="text-lg" aria-hidden="true">
      {icon}
    </span>
    <span>{label}</span>
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
    <div className="app-container grid grid-rows-[auto,1fr] bg-gray-50 min-h-screen">
      <header className="bg-white/90 border-b shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <Logo title="Khu vực quản trị" subtitle="Dành cho Ban quản lý" />
            <nav aria-label="Điều hướng quản trị" className="flex gap-2">
              {navItem('/manage/dashboard', 'Bảng điều khiển', '📊')}
              {navItem('/manage/residents', 'Cư dân', '🏠')}
              {navItem('/manage/complaints', 'Phản ánh', '📝')}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base text-gray-700">
              {user?.name} · {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm shadow-sm"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="max-w-7xl mx-auto w-full p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
