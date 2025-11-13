type Props = { title?: string; children?: React.ReactNode; type?: 'info' | 'warning' | 'error' | 'success' }

export default function Alert({ title, children, type = 'info' }: Props) {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  }[type]
  return (
    <div className={`border rounded p-3 ${styles}`} role="status" aria-live="polite">
      {title && <div className="font-medium">{title}</div>}
      {children && <div className="text-sm">{children}</div>}
    </div>
  )
}

