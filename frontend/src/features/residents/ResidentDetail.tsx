import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getResident } from '../../api/residents'
import Avatar from '../../components/UI/Avatar'
import PhotoGallery from '../../components/UI/PhotoGallery'

export default function ResidentDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useQuery({ queryKey: ['resident', id], queryFn: () => getResident(id!) })

  if (isLoading) return <div>Đang tải thông tin cư dân…</div>
  if (error || !data) return <div className="text-red-600">Không thể tải thông tin cư dân</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Thông tin cư dân</h1>
      <section className="bg-white border rounded p-4 flex items-center gap-4">
        <Avatar name={data.fullName} src={data.avatarUrl} size={64} />
        <div className="space-y-1">
          <div className="text-xl font-semibold">{data.fullName}</div>
          <div className="text-gray-700">Căn hộ: <b>{data.building}-{data.apartment}</b></div>
          <div className="text-gray-700">Liên hệ: {data.email || '-'} · {data.phone || '-'}</div>
          <div className="text-gray-600 text-sm">Tạo lúc: {new Date(data.createdAt).toLocaleString()}</div>
        </div>
      </section>

      {data.images && data.images.length > 0 && (
        <section className="bg-white border rounded p-4 space-y-2">
          <div className="font-medium">Hình ảnh</div>
          <PhotoGallery items={data.images.map((i) => ({ id: i.id, url: i.url, alt: i.filename }))} />
        </section>
      )}

      <section className="bg-white border rounded p-4 space-y-2">
        <div className="font-medium">Thành viên trong căn hộ</div>
        {!data.members?.length && <div className="text-gray-600">Chưa có thông tin</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.members || []).map((m) => (
            <div key={m.id} className="border rounded p-3">
              <div className="text-lg font-semibold">{m.fullName}</div>
              <div className="text-gray-700">Quan hệ: {m.relation}</div>
              <div className="text-gray-700">Tuổi: {m.age ?? '-'}</div>
              <div className="text-gray-700">Điện thoại: {m.phone || '-'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
