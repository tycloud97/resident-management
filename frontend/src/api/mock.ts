import { AuthResponse, Complaint, ComplaintLog, ComplaintStatus, Resident, User, Attachment, HouseholdMember, Severity } from './types'

let idCounter = 1000
const genId = () => String(idCounter++)

const users: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Alice Admin', role: 'admin' },
  { id: '2', email: 'staff@example.com', name: 'Sam Staff', role: 'staff' },
  { id: '3', email: 'res@example.com', name: 'Rita Resident', role: 'resident' },
]

let tokenStore: Record<string, string> = {}

const residents: Resident[] = [
  { id: 'r1', fullName: 'John Doe', email: 'john@example.com', phone: '0900000000', building: 'A', apartment: '101', createdAt: new Date().toISOString(), avatarUrl: '', images: [], members: [ { id: 'm1', fullName: 'Mary Doe', relation: 'Vợ', age: 35 }, { id: 'm2', fullName: 'Tom Doe', relation: 'Con', age: 8 } ] },
  { id: 'r2', fullName: 'Jane Smith', email: 'jane@example.com', phone: '0900000001', building: 'B', apartment: '202', createdAt: new Date().toISOString(), avatarUrl: '', images: [], members: [ { id: 'm3', fullName: 'Bob Smith', relation: 'Chồng', age: 38 } ] },
]

let complaints: Complaint[] = [
  { id: 'c1', title: 'Leaking pipe', description: 'Bathroom pipe leaking', residentId: 'r1', building: 'A', apartment: '101', type: 'MAINTENANCE', status: 'IN_PROGRESS', assignedTo: '2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), attachments: [], severity: 'MEDIUM', stageAssignees: { NEW: '2', IN_PROGRESS: '2' } },
]

let complaintLogs: ComplaintLog[] = [
  { id: 'l1', complaintId: 'c1', action: 'STATUS_UPDATE', message: 'Set to IN_PROGRESS', performedBy: '2', createdAt: new Date().toISOString() },
]

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function mockLogin(email: string, password: string): Promise<AuthResponse> {
  await delay()
  const user = users.find((u) => u.email === email)
  if (!user || password !== 'password') {
    throw new Error('Invalid credentials')
  }
  const token = `mock-token-${user.id}`
  tokenStore[user.id] = token
  return { user, accessToken: token }
}

export async function mockListResidents(): Promise<{ data: Resident[] }> {
  await delay()
  return { data: residents.slice().reverse() }
}

export async function mockCreateResident(payload: Omit<Resident, 'id' | 'createdAt'> & { avatar?: File | null; photos?: File[]; members?: Omit<HouseholdMember, 'id' | 'photoUrl'>[] }): Promise<Resident> {
  await delay()
  const exists = residents.some((r) => r.building === payload.building && r.apartment === payload.apartment)
  if (exists) throw new Error('Resident with this building + apartment already exists')
  const newRes: Resident = { ...payload, id: genId(), createdAt: new Date().toISOString(), images: [], members: [] }
  if (payload.avatar) {
    const url = await fileToDataUrl(payload.avatar)
    newRes.avatarUrl = url
  }
  if (payload.photos && payload.photos.length) {
    const imgs: Attachment[] = []
    for (const f of payload.photos) {
      const dataUrl = await fileToDataUrl(f)
      imgs.push({ id: genId(), url: dataUrl, filename: f.name, mimeType: f.type, size: f.size })
    }
    newRes.images = imgs
  }
  if (payload.members && payload.members.length) {
    newRes.members = payload.members.map((m) => ({ ...m, id: genId() }))
  }
  residents.push(newRes)
  return newRes
}

export async function mockGetResident(id: string): Promise<Resident> {
  await delay()
  const res = residents.find((r) => r.id === id)
  if (!res) throw new Error('Not found')
  return res
}

export async function mockListComplaints(): Promise<{ data: Complaint[] }> {
  await delay()
  return { data: complaints.slice().reverse() }
}

export async function mockCreateComplaint(payload: Omit<Complaint, 'id' | 'status' | 'createdAt'> & { files?: File[] }): Promise<Complaint> {
  await delay()
  const newC: Complaint = {
    ...payload,
    residentId: payload.isAnonymous || !payload.residentId ? 'anonymous' : payload.residentId,
    id: genId(),
    status: 'NEW',
    createdAt: new Date().toISOString(),
    attachments: [],
    severity: payload.severity || 'MEDIUM',
    stageAssignees: {},
  }
  if (payload.files && payload.files.length) {
    const atts: Attachment[] = []
    for (const f of payload.files) {
      const dataUrl = await fileToDataUrl(f)
      atts.push({ id: genId(), url: dataUrl, filename: f.name, mimeType: f.type, size: f.size })
    }
    newC.attachments = atts
  }
  complaints.push(newC)
  complaintLogs.push({ id: genId(), complaintId: newC.id, action: 'CREATE', message: 'Tạo phản ánh', performedBy: newC.residentId, createdAt: new Date().toISOString(), authorName: newC.contactName, isAnonymous: newC.isAnonymous })
  return newC
}

export async function mockGetComplaint(id: string): Promise<{ complaint: Complaint; logs: ComplaintLog[] }> {
  await delay()
  const c = complaints.find((x) => x.id === id)
  if (!c) throw new Error('Not found')
  return { complaint: c, logs: complaintLogs.filter((l) => l.complaintId === id) }
}

export async function mockUpdateComplaintStatus(id: string, status: ComplaintStatus, message?: string): Promise<Complaint> {
  await delay()
  const idx = complaints.findIndex((x) => x.id === id)
  if (idx === -1) throw new Error('Not found')
  const now = new Date().toISOString()
  const closedAt = status === 'RESOLVED' || status === 'REJECTED' ? now : complaints[idx].closedAt
  complaints[idx] = { ...complaints[idx], status, updatedAt: now, closedAt }
  complaintLogs.push({ id: genId(), complaintId: id, action: 'STATUS_UPDATE', message, createdAt: now })
  return complaints[idx]
}

export async function mockAddComplaintComment(complaintId: string, message: string, authorName?: string, isAnonymous?: boolean, files?: File[]): Promise<ComplaintLog> {
  await delay()
  const c = complaints.find((x) => x.id === complaintId)
  if (!c) throw new Error('Not found')
  const log: ComplaintLog = {
    id: genId(),
    complaintId,
    action: 'COMMENT',
    message,
    createdAt: new Date().toISOString(),
    authorName,
    isAnonymous,
    attachments: [],
  }
  if (files && files.length) {
    log.attachments = []
    for (const f of files) {
      const dataUrl = await fileToDataUrl(f)
      log.attachments.push({ id: genId(), url: dataUrl, filename: f.name, mimeType: f.type, size: f.size })
    }
  }
  complaintLogs.push(log)
  return log
}

export async function mockListStaff(): Promise<User[]> {
  await delay()
  return users.filter((u) => u.role === 'staff')
}

export async function mockAssignComplaint(complaintId: string, staffId: string, performedBy?: string): Promise<Complaint> {
  await delay()
  const idx = complaints.findIndex((x) => x.id === complaintId)
  if (idx === -1) throw new Error('Not found')
  complaints[idx] = { ...complaints[idx], assignedTo: staffId }
  complaintLogs.push({ id: genId(), complaintId, action: 'ASSIGN', message: `Giao cho cán bộ ${staffId}`, performedBy, createdAt: new Date().toISOString() })
  return complaints[idx]
}

export async function mockAssignStageHandler(complaintId: string, stage: ComplaintStatus, staffId: string): Promise<Complaint> {
  await delay()
  const c = complaints.find((x) => x.id === complaintId)
  if (!c) throw new Error('Not found')
  c.stageAssignees = { ...(c.stageAssignees || {}), [stage]: staffId }
  complaintLogs.push({ id: genId(), complaintId, action: 'ASSIGN_STAGE', message: `Giao ${stage}`, performedBy: staffId, createdAt: new Date().toISOString() })
  return c
}

export async function mockUpdateComplaintSeverity(complaintId: string, severity: Severity): Promise<Complaint> {
  await delay()
  const c = complaints.find((x) => x.id === complaintId)
  if (!c) throw new Error('Not found')
  c.severity = severity
  complaintLogs.push({ id: genId(), complaintId, action: 'SEVERITY_UPDATE', message: `Đổi mức độ: ${severity}`, createdAt: new Date().toISOString() })
  return c
}

export async function mockDashboardStats(): Promise<{ totalResidents: number; openComplaints: number; inProgress: number; resolved: number }> {
  await delay()
  return {
    totalResidents: residents.length,
    openComplaints: complaints.filter((c) => c.status === 'NEW').length,
    inProgress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
  }
}
