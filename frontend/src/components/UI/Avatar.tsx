type Props = { name: string; src?: string; size?: number }

export default function Avatar({ name, src, size = 40 }: Props) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')

  const style = { width: size, height: size }
  if (src) {
    return <img src={src} alt={name} style={style} className="rounded-full object-cover border" />
  }
  return (
    <div style={style} className="rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold border">
      {initials || '?'}
    </div>
  )
}

