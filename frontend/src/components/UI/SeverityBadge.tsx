import type { Severity } from '../../api/types'

export default function SeverityBadge({ level }: { level: Severity }) {
  const map: Record<Severity, { text: string; cls: string }> = {
    LOW: { text: 'Thấp', cls: 'bg-green-100 text-green-800' },
    MEDIUM: { text: 'Trung bình', cls: 'bg-yellow-100 text-yellow-800' },
    HIGH: { text: 'Cao', cls: 'bg-orange-100 text-orange-800' },
    CRITICAL: { text: 'Khẩn cấp', cls: 'bg-red-100 text-red-800' },
  }
  const d = map[level]
  return <span className={`inline-block text-xs px-2 py-1 rounded ${d.cls}`}>{d.text}</span>
}

