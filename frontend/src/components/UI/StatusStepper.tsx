import Button from './Button'

type Status = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

type Props = {
  value: Status
  onChange: (next: Status) => void
}

const steps: { key: Status; label: string }[] = [
  { key: 'NEW', label: 'Mới' },
  { key: 'IN_PROGRESS', label: 'Đang xử lý' },
  { key: 'RESOLVED', label: 'Đã giải quyết' },
  { key: 'REJECTED', label: 'Từ chối' },
]

export default function StatusStepper({ value, onChange }: Props) {
  const currentIdx = steps.findIndex((s) => s.key === value)

  return (
    <div className="space-y-3">
      <div className="flex items-center" role="group" aria-label="Tiến trình xử lý">
        {steps.map((s, idx) => {
          const active = idx <= currentIdx && value !== 'REJECTED'
          const selected = s.key === value
          return (
            <div key={s.key} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => onChange(s.key)}
                className={`flex flex-col items-center text-center w-full focus:outline-none`}
                aria-current={selected ? 'step' : undefined}
              >
                <span className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border ${
                  selected ? 'bg-blue-600 text-white border-blue-600' : active ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
                >{idx + 1}</span>
                <span className={`mt-1 text-sm ${selected ? 'text-blue-700' : 'text-gray-700'}`}>{s.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded ${idx < currentIdx && value !== 'REJECTED' ? 'bg-blue-400' : 'bg-gray-300'}`} aria-hidden />
              )}
            </div>
          )
        })}
      </div>
      <div className="text-sm text-gray-600">Nhấp vào mốc để cập nhật trạng thái.</div>
    </div>
  )
}

