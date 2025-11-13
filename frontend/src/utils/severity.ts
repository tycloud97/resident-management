import type { Severity } from '../api/types'

export const SEVERITY_LABEL: Record<Severity, string> = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  CRITICAL: 'Khẩn cấp',
}

// thời gian phản ứng tối thiểu (phút)
export const SEVERITY_SLA_MINUTES: Record<Severity, number> = {
  LOW: 120,
  MEDIUM: 30,
  HIGH: 15,
  CRITICAL: 5,
}

