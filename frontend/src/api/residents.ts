import { IS_MOCK, http } from './client'
import { Resident, HouseholdMember } from './types'
import { mockCreateResident, mockGetResident, mockListResidents } from './mock'

export type CreateResidentInput = Omit<Resident, 'id' | 'createdAt' | 'images' | 'avatarUrl' | 'members'> & {
  avatar?: File | null
  photos?: File[]
  members?: Omit<HouseholdMember, 'id' | 'photoUrl'>[]
}

export async function listResidents() {
  if (IS_MOCK) return mockListResidents()
  return http<{ data: Resident[] }>('/residents', { auth: true })
}

export async function createResident(payload: CreateResidentInput) {
  if (IS_MOCK) return mockCreateResident(payload)
  const fd = new FormData()
  fd.append('fullName', payload.fullName)
  if (payload.email) fd.append('email', payload.email)
  if (payload.phone) fd.append('phone', payload.phone)
  fd.append('building', payload.building)
  fd.append('apartment', payload.apartment)
  if (payload.note) fd.append('note', payload.note)
  if (payload.avatar) fd.append('avatar', payload.avatar)
  if (payload.photos) for (const f of payload.photos) fd.append('photos', f)
  if (payload.members) fd.append('members', JSON.stringify(payload.members))
  return http<Resident>('/residents', { method: 'POST', body: fd as any, auth: true })
}

export async function getResident(id: string) {
  if (IS_MOCK) return mockGetResident(id)
  return http<Resident>(`/residents/${id}`, { auth: true })
}
