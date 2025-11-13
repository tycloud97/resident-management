type Props = { status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' }

export default function StatusBadge({ status }: Props) {
  const styles: Record<Props['status'], string> = {
    NEW: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }
  const label: Record<Props['status'], string> = {
    NEW: 'Mới',
    IN_PROGRESS: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    REJECTED: 'Từ chối',
  }
  return <span className={`inline-block text-xs px-2 py-1 rounded ${styles[status]}`}>{label[status]}</span>
}
