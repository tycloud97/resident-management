import { IS_MOCK, http } from './client'
import { Complaint, ComplaintLog, ComplaintStatus, Severity } from './types'
import { mockAddComplaintComment, mockAssignComplaint, mockAssignStageHandler, mockCreateComplaint, mockGetComplaint, mockListComplaints, mockUpdateComplaintStatus, mockUpdateComplaintSeverity } from './mock'

export type CreateComplaintInput = Omit<Complaint, 'id' | 'status' | 'createdAt' | 'attachments'> & { files?: File[] }

export async function listComplaints() {
  if (IS_MOCK) return mockListComplaints()
  return http<{ data: Complaint[] }>('/complaints')
}

export async function createComplaint(payload: CreateComplaintInput) {
  if (IS_MOCK) return mockCreateComplaint(payload)
  if (payload.files && payload.files.length) {
    const fd = new FormData()
    fd.append('title', payload.title)
    fd.append('description', payload.description)
    fd.append('building', payload.building)
    fd.append('apartment', payload.apartment)
    fd.append('type', payload.type)
    if (payload.isAnonymous != null) fd.append('isAnonymous', String(payload.isAnonymous))
    if (payload.contactName) fd.append('contactName', payload.contactName)
    if (payload.contactPhone) fd.append('contactPhone', payload.contactPhone)
    if (payload.contactEmail) fd.append('contactEmail', payload.contactEmail)
    for (const f of payload.files) fd.append('files', f)
    return http<Complaint>('/complaints', { method: 'POST', body: fd as any })
  }
  const { files, ...rest } = payload
  return http<Complaint>('/complaints', { method: 'POST', body: JSON.stringify(rest) })
}

export async function getComplaint(id: string): Promise<{ complaint: Complaint; logs: ComplaintLog[] }> {
  if (IS_MOCK) return mockGetComplaint(id)
  return http<{ complaint: Complaint; logs: ComplaintLog[] }>(`/complaints/${id}`)
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus, message?: string) {
  if (IS_MOCK) return mockUpdateComplaintStatus(id, status, message)
  return http<Complaint>(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, message }), auth: true })
}

export async function addComplaintComment(id: string, message: string, authorName?: string, isAnonymous?: boolean, files?: File[]) {
  if (IS_MOCK) return mockAddComplaintComment(id, message, authorName, isAnonymous, files)
  if (files && files.length) {
    const fd = new FormData()
    fd.append('message', message)
    if (authorName) fd.append('authorName', authorName)
    if (isAnonymous != null) fd.append('isAnonymous', String(isAnonymous))
    for (const f of files) fd.append('files', f)
    return http<ComplaintLog>(`/complaints/${id}/comments`, { method: 'POST', body: fd as any })
  }
  return http<ComplaintLog>(`/complaints/${id}/comments`, { method: 'POST', body: JSON.stringify({ message, authorName, isAnonymous }) })
}

export async function assignComplaint(id: string, staffUserId: string) {
  if (IS_MOCK) return mockAssignComplaint(id, staffUserId)
  return http<Complaint>(`/complaints/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ assignedTo: staffUserId }) })
}

export async function assignStageHandler(id: string, stage: ComplaintStatus, staffUserId: string) {
  if (IS_MOCK) return mockAssignStageHandler(id, stage, staffUserId)
  return http<Complaint>(`/complaints/${id}/assign-stage`, { method: 'PATCH', body: JSON.stringify({ stage, assignedTo: staffUserId }) })
}

export async function updateComplaintSeverity(id: string, severity: Severity) {
  if (IS_MOCK) return mockUpdateComplaintSeverity(id, severity)
  return http<Complaint>(`/complaints/${id}/severity`, { method: 'PATCH', body: JSON.stringify({ severity }) })
}
