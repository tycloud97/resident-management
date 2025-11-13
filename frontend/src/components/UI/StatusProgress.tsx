import Avatar from './Avatar'

type Status = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

type StaffInfo = { name: string; avatarUrl?: string }

type Props = {
  value: Status
  onStepClick?: (next: Status) => void
  staffByStage?: Partial<Record<Status, StaffInfo | undefined>>
}

const steps: { key: Status; label: string }[] = [
  { key: 'NEW', label: 'Mới' },
  { key: 'IN_PROGRESS', label: 'Đang xử lý' },
  { key: 'RESOLVED', label: 'Đã giải quyết' },
  { key: 'REJECTED', label: 'Từ chối' },
]

const fillColor: Record<Status, string> = {
  NEW: 'bg-blue-500',
  IN_PROGRESS: 'bg-yellow-500',
  RESOLVED: 'bg-green-600',
  REJECTED: 'bg-red-600',
}

export default function StatusProgress({ value, onStepClick, staffByStage }: Props) {
  const curr = steps.findIndex((s) => s.key === value)
  const percent = Math.max(0, Math.min(100, (curr / (steps.length - 1)) * 100))
  const colorClass = fillColor[value]

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="relative w-full">
        <div className="h-3 md:h-4 w-full bg-gray-200 rounded-full" />
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${colorClass}`}
          style={{ width: `${percent}%` }}
          aria-hidden
        />
        {/* Step markers */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {steps.map((s, idx) => {
            const isPast = idx < curr && value !== 'REJECTED'
            const isCurrent = idx === curr
            const base = 'h-8 w-8 md:h-7 md:w-7 rounded-full border flex items-center justify-center text-sm md:text-xs font-bold'
            const cls = isCurrent
              ? `${fillColor[value]} text-white border-transparent`
              : isPast
              ? `${colorClass.replace('600', '400').replace('500','400')} text-white border-transparent`
              : 'bg-white text-gray-600 border-gray-300'
            const content = s.key === 'REJECTED' ? '✖' : String(idx + 1)
            return (
              <button
                key={s.key}
                type="button"
                className={`${base} ${cls}`}
                onClick={() => onStepClick?.(s.key)}
                aria-label={`Chuyển đến ${s.label}`}
              >
                {content}
              </button>
            )
          })}
        </div>
      </div>

      {/* Labels + staff */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const staff = staffByStage?.[s.key]
          return (
            <div key={s.key} className="text-center space-y-1">
              <div className="text-sm font-medium">{s.label}</div>
              {staff ? (
                <div className="flex flex-col items-center gap-1">
                  <Avatar name={staff.name} src={staff.avatarUrl} size={36} />
                  <div className="text-xs text-gray-700">{staff.name}</div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">(chưa gán)</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
