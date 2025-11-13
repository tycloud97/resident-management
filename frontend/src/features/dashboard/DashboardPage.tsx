import { useQuery } from '@tanstack/react-query'
import { getStats } from '../../api/dashboard'

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['stats'], queryFn: getStats })

  if (isLoading) return <div className="p-4">Đang tải bảng điều khiển…</div>
  if (error) return <div className="p-4 text-red-600">Không thể tải thống kê</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Tổng số cư dân" value={data!.totalResidents} />
      <StatCard label="Phản ánh mới" value={data!.openComplaints} />
      <StatCard label="Đang xử lý" value={data!.inProgress} />
      <StatCard label="Đã giải quyết" value={data!.resolved} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
