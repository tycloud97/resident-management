import { createPool, Pool } from 'mysql2/promise'

export let pool: Pool

export function parseJsonColumn<T>(value: any, defaultValue: T): T {
  if (value === null || value === undefined) return defaultValue
  if (Buffer.isBuffer(value)) {
    try {
      return JSON.parse(value.toString('utf8')) as T
    } catch {
      return defaultValue
    }
  }
  if (typeof value === 'string') {
    if (!value.trim()) return defaultValue
    try {
      return JSON.parse(value) as T
    } catch {
      return defaultValue
    }
  }
  return value as T
}

export async function initDb() {
  const host = process.env.DB_HOST || 'localhost'
  const port = Number(process.env.DB_PORT || 3307)
  const user = process.env.DB_USER || 'rm_user'
  const password = process.env.DB_PASSWORD || 'rm_pass'
  const database = process.env.DB_NAME || 'resident_db'

  pool = createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 })

  // Ensure tables exist
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS residents (
      id VARCHAR(36) PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(50) NULL,
      building VARCHAR(50) NOT NULL,
      apartment VARCHAR(50) NOT NULL,
      note TEXT NULL,
      created_at DATETIME NOT NULL,
      avatar_url VARCHAR(255) NULL,
      images JSON NULL,
      members JSON NULL,
      UNIQUE KEY uniq_building_apartment (building, apartment)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS complaints (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      resident_id VARCHAR(36) NULL,
      building VARCHAR(50) NULL,
      apartment VARCHAR(50) NULL,
      type VARCHAR(32) NULL,
      status VARCHAR(32) NOT NULL,
      assigned_to VARCHAR(36) NULL,
      severity VARCHAR(16) NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NULL,
      closed_at DATETIME NULL,
      attachments JSON NULL,
      stage_assignees JSON NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS complaint_logs (
      id VARCHAR(36) PRIMARY KEY,
      complaint_id VARCHAR(36) NOT NULL,
      action VARCHAR(64) NOT NULL,
      message TEXT NULL,
      performed_by VARCHAR(36) NULL,
      author_name VARCHAR(255) NULL,
      is_anonymous TINYINT(1) DEFAULT 0,
      attachments JSON NULL,
      created_at DATETIME NOT NULL,
      INDEX idx_complaint (complaint_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
}

export function rowToResident(row: any) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    building: row.building,
    apartment: row.apartment,
    note: row.note || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    avatarUrl: row.avatar_url || undefined,
    images: parseJsonColumn(row.images, [] as any[]),
    members: parseJsonColumn(row.members, [] as any[]),
  }
}

export function rowToComplaint(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    residentId: row.resident_id || undefined,
    building: row.building || undefined,
    apartment: row.apartment || undefined,
    type: row.type || undefined,
    status: row.status,
    assignedTo: row.assigned_to || undefined,
    severity: row.severity || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    closedAt: row.closed_at ? new Date(row.closed_at).toISOString() : undefined,
    attachments: parseJsonColumn(row.attachments, [] as any[]),
    stageAssignees: parseJsonColumn(row.stage_assignees, {} as Record<string, any>),
  }
}
