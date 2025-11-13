import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listResidents } from '../../api/residents'
import type { Resident } from '../../api/types'
import DataTable from '../../components/UI/DataTable'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import { useMemo, useState } from 'react'
import Avatar from '../../components/UI/Avatar'

export default function ResidentsList() {
  const { data, isLoading, error } = useQuery({ queryKey: ['residents'], queryFn: listResidents })
  const [query, setQuery] = useState('')
  const residents = useMemo(() => {
    const rows = data?.data ?? []
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter((r) =>
      [r.fullName, r.email, r.phone, r.building, r.apartment].some((f) => f?.toLowerCase().includes(q))
    )
  }, [data, query])

  if (isLoading) return <div className="p-4">Đang tải danh sách cư dân…</div>
  if (error) return <div className="p-4 text-red-600">Không thể tải danh sách cư dân</div>

  const columns = [
    { header: 'Cư dân', accessor: (r: Resident) => (
      <Link className="flex items-center gap-3" to={`/manage/residents/${r.id}`}>
        <Avatar name={r.fullName} src={r.avatarUrl} size={40} />
        <div>
          <div className="text-blue-700 hover:underline">{r.fullName}</div>
          <div className="text-sm text-gray-600">{r.email || '-'} · {r.phone || '-'}</div>
        </div>
      </Link>
    ) },
    { header: 'Căn hộ', accessor: (r: Resident) => `${r.building}-${r.apartment}` },
    { header: 'Thành viên', accessor: (r: Resident) => r.members?.length ?? 0 },
    { header: 'Ngày tạo', accessor: (r: Resident) => new Date(r.createdAt).toLocaleString() },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Danh sách cư dân</h1>
        <Link to="/manage/residents/new"><Button className="text-base py-3">Thêm cư dân</Button></Link>
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Tìm theo họ tên, email, điện thoại, căn hộ…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <DataTable<Resident> columns={columns} data={residents} caption="Bảng cư dân" />
    </div>
  )
}
