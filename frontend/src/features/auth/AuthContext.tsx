import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin } from '../../api/auth'
import { setToken } from '../../api/client'
import type { User } from '../../api/types'

type AuthContextType = {
  user: (User & { token: string }) | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('rms_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        setToken(parsed?.token || null)
      } catch {
        // ignore
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const resp = await apiLogin(email, password)
    const u = { ...resp.user, token: resp.accessToken }
    setUser(u)
    setToken(resp.accessToken)
    localStorage.setItem('rms_user', JSON.stringify(u))
  }

  const logout = async () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('rms_user')
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

