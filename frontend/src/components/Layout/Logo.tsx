type Props = {
  title?: string
  subtitle?: string
}

export default function Logo({ title = 'Resident Manager', subtitle }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
        RM
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base md:text-lg font-bold text-gray-900">{title}</span>
        {subtitle && <span className="text-xs text-gray-500 hidden sm:block">{subtitle}</span>}
      </div>
    </div>
  )
}

