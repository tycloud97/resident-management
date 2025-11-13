import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import Alert from '../../components/UI/Alert'
import { useAuth } from './AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-3">Đăng nhập</h1>
        <p className="text-base text-gray-700 mb-5">Tài khoản mẫu: admin@ / staff@ / res@ với mật khẩu <span className="font-mono">password</span></p>
        {error && (
          <div className="mb-3">
            <Alert type="error" title="Lỗi đăng nhập">{error}</Alert>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Mật khẩu" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full py-3 text-lg">{loading ? 'Đang đăng nhập…' : 'Đăng nhập'}</Button>
        </form>
        <div className="mt-4 text-sm text-gray-600">Không bắt buộc đăng nhập để gửi phản ánh. Bạn có thể <a className="text-blue-700 hover:underline" href="/complaints/new">gửi ẩn danh</a>.</div>
      </div>
    </div>
  )
}
