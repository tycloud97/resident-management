import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateComplaintDto } from './dto/create-complaint.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { AssignDto, AssignStageDto } from './dto/assign.dto'
import { UpdateSeverityDto } from './dto/severity.dto'
import { parseJsonColumn, pool, rowToComplaint } from '../db/mysql'
import { randomUUID } from 'crypto'

@Injectable()
export class ComplaintsService {
  async list(query: any) {
    const where: string[] = []
    const params: any[] = []
    if (query.q) {
      where.push('(title LIKE ? OR description LIKE ? OR building LIKE ? OR apartment LIKE ?)')
      const like = `%${query.q}%`
      params.push(like, like, like, like)
    }
    if (query.status) {
      where.push('status = ?')
      params.push(query.status)
    }
    if (query.type) {
      where.push('type = ?')
      params.push(query.type)
    }
    if (query.severity) {
      where.push('severity = ?')
      params.push(query.severity)
    }
    if (query.building) {
      where.push('building = ?')
      params.push(query.building)
    }
    if (query.apartment) {
      where.push('apartment = ?')
      params.push(query.apartment)
    }
    const sql = `SELECT * FROM complaints ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`
    const [rows] = await pool.query(sql, params)
    const data = (rows as any[]).map(rowToComplaint)
    return { data }
  }

  async create(dto: CreateComplaintDto, files: any[]) {
    const id = randomUUID()
    const createdAt = new Date()
    const severity = dto.severity || 'MEDIUM'
    // TODO 2025.11.14: Need to implement S3 upload
    const attachments = [files?.length
      ? files.map((f) => ({ id: f.filename, url: `/uploads/${f.filename}`, filename: f.originalname, mimeType: f.mimetype, size: f.size }))
      : []]
    const stageAssignees = {}
    await pool.execute(
      `INSERT INTO complaints (id, title, description, resident_id, building, apartment, type, status, assigned_to, severity, created_at, attachments, stage_assignees)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        dto.title,
        dto.description || null,
        dto.residentId || null,
        dto.building || null,
        dto.apartment || null,
        dto.type || null,
        'NEW',
        dto.assignedTo || null,
        severity,
        createdAt,
        attachments.length ? JSON.stringify(attachments) : null,
        JSON.stringify(stageAssignees),
      ],
    )
    await pool.execute(
      `INSERT INTO complaint_logs (id, complaint_id, action, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), id, 'CREATE', 'Complaint created', createdAt],
    )
    return {
      ...rowToComplaint({
        id,
        title: dto.title,
        description: dto.description || null,
        resident_id: dto.residentId || null,
        building: dto.building || null,
        apartment: dto.apartment || null,
        type: dto.type || null,
        status: 'NEW',
        assigned_to: dto.assignedTo || null,
        severity,
        created_at: createdAt,
        attachments: JSON.stringify(attachments),
        stage_assignees: JSON.stringify(stageAssignees),
      }),
    }
  }

  async detail(id: string) {
    const [rows] = await pool.query('SELECT * FROM complaints WHERE id = ? LIMIT 1', [id])
    const row = (rows as any[])[0]
    if (!row) throw new NotFoundException()
    const complaint = rowToComplaint(row)
    const [logRows] = await pool.query('SELECT * FROM complaint_logs WHERE complaint_id = ? ORDER BY created_at ASC', [id])
    const logs = (logRows as any[]).map((r) => ({
      id: r.id,
      complaintId: r.complaint_id,
      action: r.action,
      message: r.message || undefined,
      performedBy: r.performed_by || undefined,
      authorName: r.author_name || undefined,
      isAnonymous: !!r.is_anonymous,
      attachments: parseJsonColumn(r.attachments, [] as any[]),
      createdAt: new Date(r.created_at).toISOString(),
    }))
    return { complaint, logs }
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const now = new Date()
    const [rows] = await pool.query('SELECT status FROM complaints WHERE id = ? LIMIT 1', [id])
    if (!(rows as any[])[0]) throw new NotFoundException()
    const closedAt = dto.status === 'RESOLVED' || dto.status === 'REJECTED' ? now : null
    await pool.execute('UPDATE complaints SET status = ?, updated_at = ?, closed_at = IFNULL(?, closed_at) WHERE id = ?', [
      dto.status,
      now,
      closedAt,
      id,
    ])
    await pool.execute(
      `INSERT INTO complaint_logs (id, complaint_id, action, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), id, 'STATUS_UPDATE', dto.message || '', now],
    )
    const [after] = await pool.query('SELECT * FROM complaints WHERE id = ? LIMIT 1', [id])
    return rowToComplaint((after as any[])[0])
  }

  async assign(id: string, dto: AssignDto) {
    const now = new Date()
    const [rows] = await pool.query('SELECT id FROM complaints WHERE id = ? LIMIT 1', [id])
    if (!(rows as any[])[0]) throw new NotFoundException()
    await pool.execute('UPDATE complaints SET assigned_to = ?, updated_at = ? WHERE id = ?', [dto.assignedTo, now, id])
    await pool.execute(
      `INSERT INTO complaint_logs (id, complaint_id, action, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), id, 'ASSIGN', `assign ${dto.assignedTo}`, now],
    )
    const [after] = await pool.query('SELECT * FROM complaints WHERE id = ? LIMIT 1', [id])
    return rowToComplaint((after as any[])[0])
  }

  async assignStage(id: string, dto: AssignStageDto) {
    const now = new Date()
    const [rows] = await pool.query('SELECT stage_assignees FROM complaints WHERE id = ? LIMIT 1', [id])
    const row = (rows as any[])[0]
    if (!row) throw new NotFoundException()
    const stageAssignees = parseJsonColumn(row.stage_assignees, {} as Record<string, any>)
    stageAssignees[dto.stage] = dto.assignedTo
    await pool.execute('UPDATE complaints SET stage_assignees = ?, updated_at = ? WHERE id = ?', [
      JSON.stringify(stageAssignees),
      now,
      id,
    ])
    await pool.execute(
      `INSERT INTO complaint_logs (id, complaint_id, action, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), id, 'ASSIGN_STAGE', `assign ${dto.stage}`, now],
    )
    const [after] = await pool.query('SELECT * FROM complaints WHERE id = ? LIMIT 1', [id])
    return rowToComplaint((after as any[])[0])
  }

  async updateSeverity(id: string, dto: UpdateSeverityDto) {
    const now = new Date()
    const [rows] = await pool.query('SELECT id FROM complaints WHERE id = ? LIMIT 1', [id])
    if (!(rows as any[])[0]) throw new NotFoundException()
    await pool.execute('UPDATE complaints SET severity = ?, updated_at = ? WHERE id = ?', [dto.severity, now, id])
    await pool.execute(
      `INSERT INTO complaint_logs (id, complaint_id, action, message, created_at) VALUES (?, ?, ?, ?, ?)`,
      [randomUUID(), id, 'SEVERITY_UPDATE', `severity ${dto.severity}`, now],
    )
    const [after] = await pool.query('SELECT * FROM complaints WHERE id = ? LIMIT 1', [id])
    return rowToComplaint((after as any[])[0])
  }

  async addComment(id: string, body: any, files: any[]) {
    const [rows] = await pool.query('SELECT id FROM complaints WHERE id = ? LIMIT 1', [id])
    if (!(rows as any[])[0]) throw new NotFoundException()
    const now = new Date()
    const attachments = files?.length
      ? files.map((f) => ({ id: f.filename, url: `/uploads/${f.filename}`, filename: f.originalname, mimeType: f.mimetype, size: f.size }))
      : []
    const logId = randomUUID()
    await pool.execute(
      `INSERT INTO complaint_logs (id, complaint_id, action, message, performed_by, author_name, is_anonymous, attachments, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        id,
        'COMMENT',
        body.message || null,
        body.performedBy || null,
        body.authorName || null,
        body.isAnonymous === 'true' || body.isAnonymous === true ? 1 : 0,
        attachments.length ? JSON.stringify(attachments) : null,
        now,
      ],
    )
    return {
      id: logId,
      complaintId: id,
      action: 'COMMENT',
      message: body.message,
      performedBy: body.performedBy,
      authorName: body.authorName,
      isAnonymous: body.isAnonymous === 'true' || body.isAnonymous === true,
      attachments,
      createdAt: now.toISOString(),
    }
  }
}
