export type Role = 'resident' | 'staff' | 'admin'

export type User = {
  id: string
  email: string
  name: string
  role: Role
}

export type AuthResponse = {
  user: User
  accessToken: string
}

export type Pagination = { page: number; pageSize: number; total: number }

export type Resident = {
  id: string
  fullName: string
  email?: string
  phone?: string
  building: string
  apartment: string
  note?: string
  createdAt: string
  avatarUrl?: string
  images?: Attachment[]
  members?: HouseholdMember[]
}

export type ComplaintStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type Attachment = {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
}

export type HouseholdMember = {
  id: string
  fullName: string
  relation: string
  age?: number
  phone?: string
  photoUrl?: string
}

export type Complaint = {
  id: string
  title: string
  description: string
  residentId: string
  building: string
  apartment: string
  type: 'NOISE' | 'MAINTENANCE' | 'SECURITY' | 'OTHER'
  status: ComplaintStatus
  assignedTo?: string // userId of staff
  createdAt: string
  updatedAt?: string
  closedAt?: string
  severity?: Severity
  stageAssignees?: Partial<Record<ComplaintStatus, string>>
  // public submission support
  isAnonymous?: boolean
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  attachments?: Attachment[]
}

export type ComplaintLog = {
  id: string
  complaintId: string
  action: string
  message?: string
  performedBy?: string
  createdAt: string
  authorName?: string
  isAnonymous?: boolean
  attachments?: Attachment[]
}
