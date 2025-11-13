import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { addComplaintComment } from '../../api/complaints'
import Button from '../../components/UI/Button'
import TextArea from '../../components/UI/TextArea'
import Input from '../../components/UI/Input'
import type { ComplaintLog } from '../../api/types'
import EvidenceUploader from '../../components/UI/EvidenceUploader'

export default function CommentSection({ complaintId, comments }: { complaintId: string; comments: ComplaintLog[] }) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const mutation = useMutation({
    mutationFn: () => addComplaintComment(complaintId, message.trim(), anonymous ? undefined : name.trim() || undefined, anonymous, files),
    onSuccess: () => {
      setMessage('')
      setFiles([])
      qc.invalidateQueries({ queryKey: ['complaint', complaintId] })
    },
  })

  const commentList = comments.filter((c) => c.action === 'COMMENT')

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="font-medium text-lg">Bình luận / Bổ sung thông tin</div>
        <div className="flex items-center gap-2">
          <input id="anon" type="checkbox" className="h-5 w-5" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          <label htmlFor="anon" className="text-base">Gửi ẩn danh</label>
        </div>
        {!anonymous && (
          <Input label="Tên của bạn (không bắt buộc)" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <TextArea label="Nội dung" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
        <EvidenceUploader label="Ảnh đính kèm" onChange={setFiles} />
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !message.trim()} className="py-3 px-5 text-base">
          {mutation.isPending ? 'Đang gửi…' : 'Gửi bình luận'}
        </Button>
      </div>
      <div className="space-y-2">
        <div className="font-medium text-lg">Các bình luận</div>
        {commentList.length === 0 && <div className="text-gray-600">Chưa có bình luận</div>}
        <ul className="space-y-2">
          {commentList.map((c) => (
            <li key={c.id} className="bg-white border rounded p-3">
              <div className="text-sm text-gray-600">{new Date(c.createdAt).toLocaleString()}</div>
              <div className="text-base font-medium">{c.isAnonymous ? 'Ẩn danh' : c.authorName || 'Người dùng'}</div>
              <div className="text-base">{c.message}</div>
              {c.attachments && c.attachments.length > 0 && (
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {c.attachments.map((a) => (
                    <a key={a.id} href={a.url} target="_blank" rel="noreferrer">
                      <img src={a.url} alt={a.filename} className="w-full h-24 object-cover rounded border" />
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
