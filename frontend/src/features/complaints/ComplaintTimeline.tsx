import type { ComplaintLog } from '../../api/types'

export default function ComplaintTimeline({ logs }: { logs: ComplaintLog[] }) {
  return (
    <ol className="relative border-s pl-4">
      {logs.map((l) => (
        <li key={l.id} className="mb-4">
          <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-500" aria-hidden />
          <div className="text-sm text-gray-600">{new Date(l.createdAt).toLocaleString()}</div>
          <div className="font-medium">
            {l.action === 'CREATE' && 'Tạo phản ánh'}
            {l.action === 'STATUS_UPDATE' && 'Cập nhật trạng thái'}
            {l.action !== 'CREATE' && l.action !== 'STATUS_UPDATE' && l.action}
          </div>
          {l.message && <div className="text-sm text-gray-700">{l.message}</div>}
        </li>
      ))}
      {logs.length === 0 && <li className="text-sm text-gray-500">Chưa có lịch sử</li>}
    </ol>
  )
}
