import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateResidentDto } from './dto/create-resident.dto'

@Injectable()
export class ResidentsService {
  private residents: any[] = [
    { id: 'r1', fullName: 'John Doe', email: 'john@example.com', phone: '0900000000', building: 'A', apartment: '101', createdAt: new Date().toISOString(), images: [], members: [] },
    { id: 'r2', fullName: 'Jane Smith', email: 'jane@example.com', phone: '0900000001', building: 'B', apartment: '202', createdAt: new Date().toISOString(), images: [], members: [] },
  ]

  findAll(q?: string, building?: string, apartment?: string) {
    let data = [...this.residents]
    if (q) {
      const s = q.toLowerCase()
      data = data.filter((r) => [r.fullName, r.email, r.phone, r.building, r.apartment].some((v) => String(v || '').toLowerCase().includes(s)))
    }
    if (building) data = data.filter((r) => r.building === building)
    if (apartment) data = data.filter((r) => r.apartment === apartment)
    return { data }
  }

  create(dto: CreateResidentDto, files: { avatar?: Express.Multer.File; photos?: Express.Multer.File[] }) {
    if (this.residents.some((r) => r.building === dto.building && r.apartment === dto.apartment)) {
      throw new Error('Resident exists')
    }
    const id = 'r' + (this.residents.length + 1)
    const createdAt = new Date().toISOString()
    const resident: any = { id, createdAt, images: [], ...dto }
    if (files.avatar) resident.avatarUrl = `/uploads/${files.avatar.filename}`
    if (files.photos?.length) resident.images = files.photos.map((f) => ({ id: f.filename, url: `/uploads/${f.filename}`, filename: f.originalname, mimeType: f.mimetype, size: f.size }))
    this.residents.push(resident)
    return resident
  }

  findOne(id: string) {
    const r = this.residents.find((x) => x.id === id)
    if (!r) throw new NotFoundException()
    return r
  }
}

