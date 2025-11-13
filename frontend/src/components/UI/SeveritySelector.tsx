import type { Severity } from '../../api/types'

type Option = { key: Severity; label: string; desc: string; cls: string; border: string }

const OPTIONS: Option[] = [
  { key: 'LOW', label: 'Thấp', desc: 'Không khẩn cấp', cls: 'bg-green-50 text-green-800', border: 'border-green-300' },
  { key: 'MEDIUM', label: 'Trung bình', desc: 'Xử lý sớm', cls: 'bg-yellow-50 text-yellow-800', border: 'border-yellow-300' },
  { key: 'HIGH', label: 'Cao', desc: 'Ưu tiên cao', cls: 'bg-orange-50 text-orange-800', border: 'border-orange-300' },
  { key: 'CRITICAL', label: 'Khẩn cấp', desc: 'Xử lý ngay', cls: 'bg-red-50 text-red-800', border: 'border-red-300' },
]

export default function SeveritySelector({ value, onChange, disabled }: { value: Severity; onChange: (s: Severity) => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Chọn mức độ" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {OPTIONS.map((opt) => {
        const selected = value === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(opt.key)}
            className={`text-left rounded-xl border p-3 md:p-2 transition-colors focus:outline-none focus:ring-2 ${opt.border} ${selected ? opt.cls + ' ring-2 ring-offset-1 ' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
          >
            <div className="font-semibold text-base md:text-sm">{opt.label}</div>
            <div className="text-sm md:text-xs opacity-80">{opt.desc}</div>
          </button>
        )
      })}
    </div>
  )
}

