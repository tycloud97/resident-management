import { FormEvent, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Input from '../../components/UI/Input'
import TextArea from '../../components/UI/TextArea'
import Button from '../../components/UI/Button'
import Alert from '../../components/UI/Alert'
import { createComplaint } from '../../api/complaints'
import Select from '../../components/UI/Select'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import EvidenceUploader from '../../components/UI/EvidenceUploader'
import { SEVERITY_LABEL } from '../../utils/severity'
import { getApartmentOptions, getBuildingOptions } from '../../config/units'

export default function ComplaintForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    description: '',
    building: '',
    apartment: '',
    type: 'OTHER' as 'NOISE' | 'MAINTENANCE' | 'SECURITY' | 'OTHER',
    isAnonymous: true,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    severity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  })
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (user && form.isAnonymous === false) {
      setForm((s) => ({
        ...s,
        contactName: s.contactName || user.name,
        contactEmail: s.contactEmail || user.email,
      }))
    }
  }, [user, form.isAnonymous])

  const mutation = useMutation({
    mutationFn: () => createComplaint({ ...(form as any), files }),
    onSuccess: (c) => navigate(`/complaints/${c.id}`),
    onError: (err: any) => setServerError(err?.message || 'Không thể tạo phản ánh'),
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Vui lòng nhập tiêu đề'
    if (!form.description.trim()) e.description = 'Vui lòng nhập nội dung'
    if (!form.building.trim()) e.building = 'Vui lòng nhập tòa'
    if (!form.apartment.trim()) e.apartment = 'Vui lòng nhập căn hộ'
    if (!form.isAnonymous && !form.contactName.trim()) e.contactName = 'Vui lòng nhập tên'
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) e.contactEmail = 'Email không hợp lệ'
    if (form.contactPhone && !/^[0-9]{9,15}$/.test(form.contactPhone)) e.contactPhone = 'Số điện thoại không hợp lệ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const set = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return
    mutation.mutate()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Gửi phản ánh</h1>
      <div className="mb-3 text-base text-gray-700">Bạn có thể gửi <b>ẩn danh</b> hoặc bỏ ẩn danh để điền thông tin liên hệ.</div>
      {serverError && <div className="mb-3"><Alert type="error" title="Lỗi">{serverError}</Alert></div>}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input label="Tiêu đề" value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} required />
        <TextArea label="Nội dung" value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} rows={5} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select label="Tòa" value={form.building} onChange={(e) => { set('building', e.target.value); set('apartment', ''); }}>
            <option value="">Chọn tòa…</option>
            {getBuildingOptions().map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          <Select label="Căn hộ" value={form.apartment} onChange={(e) => set('apartment', e.target.value)}>
            <option value="">Chọn căn hộ…</option>
            {getApartmentOptions(form.building).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <Select label="Loại" value={form.type} onChange={(e) => set('type', e.target.value)}>
          <option value="MAINTENANCE">Sửa chữa</option>
          <option value="NOISE">Tiếng ồn</option>
          <option value="SECURITY">An ninh</option>
          <option value="OTHER">Khác</option>
        </Select>
        <Select label="Mức độ nghiêm trọng" value={form.severity} onChange={(e) => set('severity', e.target.value)}>
          {Object.entries(SEVERITY_LABEL).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>
        <div className="flex items-center gap-2">
          <input id="anonymous" type="checkbox" className="h-5 w-5" checked={form.isAnonymous} onChange={(e) => set('isAnonymous', e.target.checked)} />
          <label htmlFor="anonymous" className="text-base">Gửi ẩn danh</label>
        </div>
        <EvidenceUploader onChange={setFiles} />
        {!form.isAnonymous && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Họ và tên" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} error={errors.contactName} required />
            <Input label="Số điện thoại" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} error={errors.contactPhone} />
            <Input label="Email" type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} error={errors.contactEmail} />
          </div>
        )}
        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending} className="py-3 px-5 text-base">{mutation.isPending ? 'Đang gửi…' : 'Gửi phản ánh'}</Button>
          <Button type="button" variant="secondary" onClick={() => history.back()} className="py-3 px-5 text-base">Hủy</Button>
        </div>
      </form>
    </div>
  )
}
