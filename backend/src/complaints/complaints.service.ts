import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateComplaintDto } from './dto/create-complaint.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { AssignDto, AssignStageDto } from './dto/assign.dto'
import { UpdateSeverityDto } from './dto/severity.dto'

@Injectable()
export class ComplaintsService {
  private complaints: any[] = [
    { id: 'c1', title: 'Leaking pipe', description: 'Bathroom pipe leaking', residentId: 'r1', building: 'A', apartment: '101', type: 'MAINTENANCE', status: 'IN_PROGRESS', assignedTo: '2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), attachments: [], severity: 'MEDIUM', stageAssignees: { NEW: '2', IN_PROGRESS: '2' } },
  ]
  private logs: any[] = [
    { id: 'l1', complaintId: 'c1', action: 'STATUS_UPDATE', message: 'Set to IN_PROGRESS', performedBy: '2', createdAt: new Date().toISOString() },
  ]

  list(query: any) {
    let data = [...this.complaints]
    if (query.q) {
      const s = String(query.q).toLowerCase()
      data = data.filter((c) => [c.title, c.description, c.building, c.apartment].some((v) => String(v || '').toLowerCase().includes(s)))
    }
    if (query.status) data = data.filter((c) => c.status === query.status)
    if (query.type) data = data.filter((c) => c.type === query.type)
    if (query.severity) data = data.filter((c) => c.severity === query.severity)
    if (query.building) data = data.filter((c) => c.building === query.building)
    if (query.apartment) data = data.filter((c) => c.apartment === query.apartment)
    return { data }
  }

  create(dto: CreateComplaintDto, files: Express.Multer.File[]) {
    const id = 'c' + (this.complaints.length + 1)
    const createdAt = new Date().toISOString()
    const complaint: any = { id, status: 'NEW', createdAt, attachments: [], stageAssignees: {}, ...dto }
    if (files?.length) complaint.attachments = files.map((f) => ({ id: f.filename, url: `/uploads/${f.filename}`, filename: f.originalname, mimeType: f.mimetype, size: f.size }))
    this.complaints.push(complaint)
    this.logs.push({ id: 'l' + (this.logs.length + 1), complaintId: id, action: 'CREATE', message: 'Complaint created', createdAt })
    return complaint
  }

  detail(id: string) {
    const complaint = this.complaints.find((x) => x.id === id)
    if (!complaint) throw new NotFoundException()
    const logs = this.logs.filter((l) => l.complaintId === id)
    return { complaint, logs }
  }

  updateStatus(id: string, dto: UpdateStatusDto) {
    const idx = this.complaints.findIndex((x) => x.id === id)
    if (idx === -1) throw new NotFoundException()
    const now = new Date().toISOString()
    const closedAt = dto.status === 'RESOLVED' || dto.status === 'REJECTED' ? now : this.complaints[idx].closedAt
    this.complaints[idx] = { ...this.complaints[idx], status: dto.status, updatedAt: now, closedAt }
    this.logs.push({ id: 'l' + (this.logs.length + 1), complaintId: id, action: 'STATUS_UPDATE', message: dto.message, createdAt: now })
    return this.complaints[idx]
  }

  assign(id: string, dto: AssignDto) {
    const idx = this.complaints.findIndex((x) => x.id === id)
    if (idx === -1) throw new NotFoundException()
    this.complaints[idx] = { ...this.complaints[idx], assignedTo: dto.assignedTo }
    this.logs.push({ id: 'l' + (this.logs.length + 1), complaintId: id, action: 'ASSIGN', message: `assign ${dto.assignedTo}`, createdAt: new Date().toISOString() })
    return this.complaints[idx]
  }

  assignStage(id: string, dto: AssignStageDto) {
    const idx = this.complaints.findIndex((x) => x.id === id)
    if (idx === -1) throw new NotFoundException()
    const stageAssignees = { ...(this.complaints[idx].stageAssignees || {}), [dto.stage]: dto.assignedTo }
    this.complaints[idx] = { ...this.complaints[idx], stageAssignees }
    this.logs.push({ id: 'l' + (this.logs.length + 1), complaintId: id, action: 'ASSIGN_STAGE', message: `assign ${dto.stage}`, createdAt: new Date().toISOString() })
    return this.complaints[idx]
  }

  updateSeverity(id: string, dto: UpdateSeverityDto) {
    const idx = this.complaints.findIndex((x) => x.id === id)
    if (idx === -1) throw new NotFoundException()
    this.complaints[idx] = { ...this.complaints[idx], severity: dto.severity }
    this.logs.push({ id: 'l' + (this.logs.length + 1), complaintId: id, action: 'SEVERITY_UPDATE', message: `severity ${dto.severity}`, createdAt: new Date().toISOString() })
    return this.complaints[idx]
  }

  addComment(id: string, body: any, files: Express.Multer.File[]) {
    const complaint = this.complaints.find((x) => x.id === id)
    if (!complaint) throw new NotFoundException()
    const log: any = { id: 'l' + (this.logs.length + 1), complaintId: id, action: 'COMMENT', message: body.message, createdAt: new Date().toISOString(), authorName: body.authorName, isAnonymous: body.isAnonymous === 'true' || body.isAnonymous === true }
    if (files?.length) log.attachments = files.map((f) => ({ id: f.filename, url: `/uploads/${f.filename}`, filename: f.originalname, mimeType: f.mimetype, size: f.size }))
    this.logs.push(log)
    return log
  }
}

