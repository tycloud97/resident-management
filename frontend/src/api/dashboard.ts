import { IS_MOCK, http } from './client'
import { mockDashboardStats } from './mock'

export async function getStats() {
  if (IS_MOCK) return mockDashboardStats()
  return http<{ totalResidents: number; openComplaints: number; inProgress: number; resolved: number }>(
    '/dashboard/stats'
  )
}
