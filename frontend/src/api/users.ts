import { IS_MOCK, http } from './client'
import type { User } from './types'
import { mockListStaff } from './mock'

export async function listStaff(): Promise<User[]> {
  if (IS_MOCK) return mockListStaff()
  return http<User[]>('/users?role=staff')
}

