import { useEffect, useMemo, useState } from 'react'

function format(mm: number, ss: number) {
  const m = String(mm).padStart(2, '0')
  const s = String(ss).padStart(2, '0')
  return `${m}:${s}`
}

export default function Countdown({ target, warnSeconds = 60, labelPrefix = 'Còn lại' }: { target: Date; warnSeconds?: number; labelPrefix?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const remainingMs = Math.max(0, target.getTime() - now.getTime())
  const remainingSec = Math.floor(remainingMs / 1000)
  const mm = Math.floor(remainingSec / 60)
  const ss = remainingSec % 60
  const color = remainingSec === 0 ? 'text-red-700' : remainingSec <= warnSeconds ? 'text-orange-600' : 'text-gray-800'
  return <span className={`font-semibold ${color}`}>{labelPrefix}: {format(mm, ss)}</span>
}

