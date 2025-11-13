import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listComplaints } from '../../api/complaints'
import type { Complaint } from '../../api/types'
import DataTable, { StatusBadge } from '../../components/UI/DataTable'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'
import { useMemo, useState } from 'react'
import { listStaff } from '../../api/users'
import { SEVERITY_LABEL } from '../../utils/severity'

export default function ComplaintList() {
  const { data, isLoading, error } = useQuery({ queryKey: ['complaints'], queryFn: listComplaints })
  const staffQuery = useQuery({ queryKey: ['staff'], queryFn: listStaff })
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  const filtered = useMemo(() => {
    const rows = data?.data ?? []
    return rows.filter((c) => {
      const matchQ = q ? [c.title, c.description, c.building, c.apartment].some((f) => f.toLowerCase().includes(q.toLowerCase())) : true
      const matchStatus = status ? c.status === status : true
      const matchType = type ? c.type === type : true
      return matchQ && matchStatus && matchType
    })
  }, [data, q, status, type])

  if (isLoading) return <div className="p-4">Đang tải danh sách phản ánh…</div>
  if (error) return <div className="p-4 text-red-600">Không thể tải danh sách phản ánh</div>

  const staffMap = new Map((staffQuery.data || []).map((s) => [s.id, s.name]))
  const columns = [
    { header: 'Tiêu đề', accessor: (c: Complaint) => <Link className="text-blue-700 hover:underline" to={`/complaints/${c.id}`}>{c.title}</Link> },
    { header: 'Loại', accessor: (c: Complaint) => c.type },
    { header: 'Mức độ', accessor: (c: Complaint) => SEVERITY_LABEL[c.severity || 'MEDIUM'] },
    { header: 'Căn hộ', accessor: (c: Complaint) => `${c.building}-${c.apartment}` },
    { header: 'Trạng thái', accessor: (c: Complaint) => <StatusBadge status={c.status} /> },
    { header: 'Cán bộ xử lý', accessor: (c: Complaint) => c.assignedTo ? (staffMap.get(c.assignedTo) || c.assignedTo) : '—' },
    { header: 'Ngày tạo', accessor: (c: Complaint) => new Date(c.createdAt).toLocaleString() },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Danh sách phản ánh</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input placeholder="Tìm theo tiêu đề, mô tả, căn hộ…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="NEW">NEW</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="REJECTED">REJECTED</option>
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tất cả loại</option>
          <option value="MAINTENANCE">Sửa chữa</option>
          <option value="NOISE">Tiếng ồn</option>
          <option value="SECURITY">An ninh</option>
          <option value="OTHER">Khác</option>
        </Select>
      </div>
      <DataTable<Complaint> columns={columns} data={filtered} caption="Bảng phản ánh" />
    </div>
  )
}
