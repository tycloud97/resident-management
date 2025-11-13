export function formatDuration(ms: number) {
  const sec = Math.floor(ms / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  const parts: string[] = []
  if (day) parts.push(`${day} ngày`)
  if (hr % 24) parts.push(`${hr % 24} giờ`)
  if (min % 60) parts.push(`${min % 60} phút`)
  if (!parts.length) return `${sec} giây`
  return parts.join(' ')
}

