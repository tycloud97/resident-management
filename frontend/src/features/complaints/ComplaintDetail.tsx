import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { assignComplaint, assignStageHandler, getComplaint, updateComplaintStatus } from '../../api/complaints'
import StatusBadge from '../../components/UI/StatusBadge'
import Select from '../../components/UI/Select'
import ComplaintTimeline from './ComplaintTimeline'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import CommentSection from './CommentSection'
import { listStaff } from '../../api/users'
import StatusProgress from '../../components/UI/StatusProgress'
import { formatDuration } from '../../utils/time'
import Countdown from '../../components/UI/Countdown'
import { SEVERITY_LABEL, SEVERITY_SLA_MINUTES } from '../../utils/severity'
import Modal from '../../components/UI/Modal'
import Button from '../../components/UI/Button'
import SeverityBadge from '../../components/UI/SeverityBadge'
import { updateComplaintSeverity } from '../../api/complaints'
import SeveritySelector from '../../components/UI/SeveritySelector'

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['complaint', id], queryFn: () => getComplaint(id!) })
  const { user } = useAuth()
  const staffQuery = useQuery({ queryKey: ['staff'], queryFn: listStaff })
  const [note, setNote] = useState('')
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [nextStatus, setNextStatus] = useState<'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'>('IN_PROGRESS')
  const [nextAssignee, setNextAssignee] = useState('')
  const mutation = useMutation({
    mutationFn: ({ next, msg }: { next: any; msg?: string }) => updateComplaintStatus(id!, next, msg),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaint', id] })
      setNote('')
      setStatusModalOpen(false)
    },
  })
  const assignMutation = useMutation({
    mutationFn: (staffId: string) => assignComplaint(id!, staffId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaint', id] }),
  })
  const assignStageMutation = useMutation({
    mutationFn: (payload: { stage: 'NEW'|'IN_PROGRESS'|'RESOLVED'|'REJECTED'; userId: string }) => assignStageHandler(id!, payload.stage, payload.userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaint', id] }),
  })
  const severityMutation = useMutation({
    mutationFn: (sev: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL') => updateComplaintSeverity(id!, sev),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['complaint', id] }),
  })

  if (isLoading) return <div>Đang tải phản ánh…</div>
  if (error || !data) return <div className="text-red-600">Không thể tải phản ánh</div>

  const { complaint, logs } = data
  const lastStatusLog = [...logs].reverse().find((l) => l.action === 'STATUS_UPDATE' && (complaint.status === 'RESOLVED' || complaint.status === 'REJECTED'))
  const closedAt = complaint.closedAt || lastStatusLog?.createdAt
  const end = closedAt ? new Date(closedAt) : new Date()
  const start = new Date(complaint.createdAt)
  const durationLabel = formatDuration(end.getTime() - start.getTime())
  const slaMinutes = SEVERITY_SLA_MINUTES[(complaint.severity || 'MEDIUM')]
  const slaTarget = new Date(new Date(complaint.createdAt).getTime() + slaMinutes * 60_000)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
        <div className={`bg-white border rounded p-4 space-y-2 ${
          complaint.severity === 'CRITICAL' ? 'ring-2 ring-red-500' : complaint.severity === 'HIGH' ? 'ring-2 ring-orange-500' : complaint.severity === 'MEDIUM' ? 'ring-2 ring-yellow-400' : 'ring-1 ring-green-400'
        }`}>
          <div className="text-sm text-gray-600">Mã: {complaint.id}</div>
          <div><span className="text-gray-500">Căn hộ:</span> {complaint.building}-{complaint.apartment}</div>
          <div><span className="text-gray-500">Loại:</span> {complaint.type}</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><span className="text-gray-500">Mức độ:</span> <SeverityBadge level={complaint.severity || 'MEDIUM'} /></div>
            {(user?.role === 'staff' || user?.role === 'admin') && (
              <SeveritySelector value={(complaint.severity || 'MEDIUM') as any} onChange={(sev) => severityMutation.mutate(sev as any)} disabled={severityMutation.isPending} />
            )}
          </div>
          <div className="flex items-center gap-2"><span className="text-gray-500">Trạng thái:</span> <StatusBadge status={complaint.status} /></div>
            <div className="pt-2">
              <div className="text-gray-500">Nội dung phản ánh</div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{complaint.description}</p>
            </div>
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-gray-500">Ảnh minh chứng</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {complaint.attachments.map((a) => (
                    <a key={a.id} href={a.url} target="_blank" rel="noreferrer">
                      <img src={a.url} alt={a.filename} className="w-full h-28 object-cover rounded border" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-white border rounded p-4">
            <CommentSection complaintId={complaint.id} comments={logs} />
          </div>
        </div>
      <div className="space-y-3">
        <div className="bg-white border rounded p-4 space-y-3">
          <div className="font-medium">Tiến trình xử lý</div>
          <StatusProgress
            value={complaint.status as any}
            onStepClick={user?.role === 'staff' || user?.role === 'admin' ? (next) => { setNextStatus(next as any); setStatusModalOpen(true) } : undefined}
            staffByStage={{
              NEW: complaint.stageAssignees?.NEW ? { name: (staffQuery.data || []).find(s => s.id === complaint.stageAssignees!.NEW)?.name || complaint.stageAssignees!.NEW } : undefined,
              IN_PROGRESS: complaint.stageAssignees?.IN_PROGRESS ? { name: (staffQuery.data || []).find(s => s.id === complaint.stageAssignees!.IN_PROGRESS)?.name || complaint.stageAssignees!.IN_PROGRESS } : undefined,
              RESOLVED: complaint.stageAssignees?.RESOLVED ? { name: (staffQuery.data || []).find(s => s.id === complaint.stageAssignees!.RESOLVED)?.name || complaint.stageAssignees!.RESOLVED } : undefined,
              REJECTED: complaint.stageAssignees?.REJECTED ? { name: (staffQuery.data || []).find(s => s.id === complaint.stageAssignees!.REJECTED)?.name || complaint.stageAssignees!.REJECTED } : undefined,
            }}
          />
          {(user?.role === 'staff' || user?.role === 'admin') && (
            <>
              <input
                type="text"
                className="block w-full rounded border px-3 py-2 text-sm border-gray-300"
                placeholder="Ghi chú (không bắt buộc)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              {mutation.isPending && <div className="text-sm text-gray-600">Đang cập nhật trạng thái…</div>}
            </>
          )}
        </div>
          <div className="bg-white border rounded p-4">
            <div className="font-medium">Thời gian xử lý</div>
            <div className="text-sm text-gray-700 mt-1">{durationLabel}{closedAt ? ' (đã hoàn tất)' : ' (đang diễn ra)'}</div>
            <div className="mt-2 text-sm text-gray-700">Mức độ: <b>{SEVERITY_LABEL[complaint.severity || 'MEDIUM']}</b> · SLA phản ứng: <b>{slaMinutes} phút</b></div>
            {!closedAt && <div className="mt-2"><Countdown target={slaTarget} warnSeconds={60} labelPrefix="Thời gian phản ứng còn" /></div>}
          </div>
        {(user?.role === 'staff' || user?.role === 'admin') && (
          <div className="bg-white border rounded p-4 space-y-3">
            <div className="font-medium">Phân công cán bộ</div>
            <Select  value={data.complaint.assignedTo || ''} onChange={(e) => assignMutation.mutate(e.target.value)}>
              <option value="">Chưa phân công</option>
              {(staffQuery.data || []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
            {assignMutation.isPending && <div className="text-sm text-gray-600">Đang phân công…</div>}
          </div>
        )}
        {(user?.role === 'staff' || user?.role === 'admin') && (
          <div className="bg-white border rounded p-4 space-y-2">
            <div className="font-medium">Phân công theo giai đoạn</div>
            {(['NEW','IN_PROGRESS','RESOLVED','REJECTED'] as const).map((st) => (
              <div key={st} className="grid grid-cols-2 gap-2 items-center">
                <div className="text-sm text-gray-700">{st === 'NEW' ? 'Mới' : st === 'IN_PROGRESS' ? 'Đang xử lý' : st === 'RESOLVED' ? 'Đã giải quyết' : 'Từ chối'}</div>
                <Select value={complaint.stageAssignees?.[st] || ''} onChange={(e) => assignStageMutation.mutate({ stage: st, userId: e.target.value })}>
                  <option value="">(trống)</option>
                  {(staffQuery.data || []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        )}
          <div className="bg-white border rounded p-4">
            <div className="font-medium mb-2">Dòng thời gian</div>
            <ComplaintTimeline logs={logs.filter((l) => l.action !== 'COMMENT')} />
          </div>
        </div>
      </div>
      <Modal
        open={statusModalOpen}
        title="Cập nhật trạng thái"
        onClose={() => setStatusModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>Hủy</Button>
            <Button onClick={() => {
              mutation.mutate({ next: nextStatus, msg: note || undefined })
              if (nextAssignee) assignStageMutation.mutate({ stage: nextStatus, userId: nextAssignee })
            }}>Xác nhận</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>Trạng thái mới: <b>{nextStatus}</b></div>
          <Select value={nextAssignee} onChange={(e) => setNextAssignee(e.target.value)}>
            <option value="">Chọn người phụ trách giai đoạn</option>
            {(staffQuery.data || []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <input
            type="text"
            className="block w-full rounded border px-3 py-2 text-sm border-gray-300"
            placeholder="Ghi chú (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Modal>
    </>
  )
}
