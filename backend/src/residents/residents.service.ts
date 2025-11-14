import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateResidentDto } from './dto/create-resident.dto'
import { pool, rowToResident } from '../db/mysql'
import { randomUUID } from 'crypto'

@Injectable()
export class ResidentsService {
  async findAll(q?: string, building?: string, apartment?: string) {
    const where: string[] = []
    const params: any[] = []
    if (q) {
      where.push('(full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR building LIKE ? OR apartment LIKE ?)')
      const like = `%${q}%`
      params.push(like, like, like, like, like)
    }
    if (building) {
      where.push('building = ?')
      params.push(building)
    }
    if (apartment) {
      where.push('apartment = ?')
      params.push(apartment)
    }
    const sql = `SELECT * FROM residents ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`
    const [rows] = await pool.query(sql, params)
    const data = (rows as any[]).map(rowToResident)
    return { data }
  }

  async create(dto: CreateResidentDto, files: { avatar?: Express.Multer.File; photos?: Express.Multer.File[] }) {
    const [dup] = await pool.query('SELECT id FROM residents WHERE building = ? AND apartment = ? LIMIT 1', [
      dto.building,
      dto.apartment,
    ])
    if ((dup as any[]).length) throw new Error('Resident exists')

    const id = randomUUID()
    const createdAt = new Date()
    const avatarUrl = files.avatar ? `/uploads/${files.avatar.filename}` : null
    const images = files.photos?.length
      ? files.photos.map((f) => ({ id: f.filename, url: `/uploads/${f.filename}`, filename: f.originalname, mimeType: f.mimetype, size: f.size }))
      : []

    await pool.execute(
      `INSERT INTO residents (id, full_name, email, phone, building, apartment, note, created_at, avatar_url, images, members)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        dto.fullName,
        dto.email || null,
        dto.phone || null,
        dto.building,
        dto.apartment,
        dto.note || null,
        createdAt,
        avatarUrl,
        images && images.length ? JSON.stringify(images) : null,
        dto.members && dto.members.length ? JSON.stringify(dto.members) : null,
      ],
    )

    return {
      id,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      building: dto.building,
      apartment: dto.apartment,
      note: dto.note,
      createdAt: createdAt.toISOString(),
      avatarUrl: avatarUrl || undefined,
      images,
      members: dto.members || [],
    }
  }

  async findOne(id: string) {
    const [rows] = await pool.query('SELECT * FROM residents WHERE id = ? LIMIT 1', [id])
    const r = (rows as any[])[0]
    if (!r) throw new NotFoundException()
    return rowToResident(r)
  }
}

