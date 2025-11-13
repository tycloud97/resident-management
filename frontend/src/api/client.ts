import { AuthResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined
export const IS_MOCK = (import.meta.env.VITE_USE_MOCKS as string | undefined) === 'true'

let token: string | null = null

export function setToken(t: string | null) {
  token = t
}

type Opts = RequestInit & { auth?: boolean }

export async function http<T>(path: string, opts: Opts = {}): Promise<T> {
  if (!BASE_URL && !IS_MOCK) throw new Error('VITE_API_BASE_URL is not set')
  const url = `${BASE_URL}${path}`
  const isFormData = typeof FormData !== 'undefined' && opts.body instanceof FormData
  const headers: HeadersInit = isFormData
    ? { ...(opts.headers || {}) }
    : { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  if (opts.auth && token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...opts, headers })
  const text = await res.text()
  let data: any
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    const message = data?.message || res.statusText
    const error = new Error(message)
    ;(error as any).status = res.status
    ;(error as any).payload = data
    throw error
  }
  return data as T
}

// Convenience: login to set token
export function onLogin(resp: AuthResponse) {
  setToken(resp.accessToken)
}
