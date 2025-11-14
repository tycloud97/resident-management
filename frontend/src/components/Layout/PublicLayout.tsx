import type { ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import Logo from './Logo'

const navLink = (to: string, label: string, icon: ReactNode) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-base md:text-lg font-medium hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 ${
        isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-800'
      }`
    }
  >
    <span className="text-xl" aria-hidden="true">
      {icon}
    </span>
    <span>{label}</span>
  </NavLink>
)

export default function PublicLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }
  const appName = import.meta.env.VITE_APP_NAME || 'Quản lý Cư dân'

  return (
    <div className="app-container grid grid-rows-[auto,1fr] bg-gray-50 min-h-screen">
      <header className="bg-white/90 border-b shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <Logo title={appName} subtitle="Cổng cư dân & phản ánh" />
            <nav aria-label="Điều hướng chính" className="hidden md:flex gap-2">
              {navLink('/dashboard', 'Bảng điều khiển', '🏠')}
              {navLink('/complaints', 'Danh sách phản ánh', '📋')}
              {navLink('/complaints/new', 'Gửi phản ánh', '✉️')}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {!user ? (
              <a href="/login" className="px-4 py-3 rounded-lg text-base md:text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700">Đăng nhập</a>
            ) : (
              <>
                <a href="/manage" className="px-4 py-3 rounded-lg text-base md:text-lg font-semibold bg-green-600 text-white hover:bg-green-700">Khu vực quản trị</a>
                <button onClick={handleLogout} className="px-4 py-3 rounded-lg text-base md:text-lg font-semibold bg-red-600 text-white hover:bg-red-700">Đăng xuất</button>
              </>
            )}
          </div>
          <nav aria-label="Điều hướng chính (mobile)" className="md:hidden flex gap-2">
            {navLink('/dashboard', 'Bảng điều khiển', '🏠')}
            {navLink('/complaints', 'Phản ánh', '📋')}
            {navLink('/complaints/new', 'Gửi phản ánh', '✉️')}
          </nav>
        </div>
      </header>
      <main id="main" className="max-w-5xl mx-auto w-full p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
