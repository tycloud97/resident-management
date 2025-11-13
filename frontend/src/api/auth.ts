import { IS_MOCK, http, onLogin } from './client'
import { AuthResponse } from './types'
import { mockLogin } from './mock'

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (IS_MOCK) {
    const resp = await mockLogin(email, password)
    onLogin(resp)
    return resp
  }
  const resp = await http<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  onLogin(resp)
  return resp
}

