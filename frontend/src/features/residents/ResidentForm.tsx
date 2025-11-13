import { FormEvent, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createResident } from '../../api/residents'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Alert from '../../components/UI/Alert'
import { useNavigate } from 'react-router-dom'
import EvidenceUploader from '../../components/UI/EvidenceUploader'
import Select from '../../components/UI/Select'
import { getApartmentOptions, getBuildingOptions } from '../../config/units'

export default function ResidentForm() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', building: '', apartment: '', note: '' })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [members, setMembers] = useState<{ fullName: string; relation: string; age?: string; phone?: string }[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => createResident({ ...form, avatar, photos, members: members.map((m) => ({ ...m, age: m.age ? Number(m.age) : undefined })) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['residents'] })
      navigate('/residents')
    },
    onError: (err: any) => setServerError(err?.message || 'Failed to create resident'),
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên'
    if (!form.building.trim()) e.building = 'Vui lòng chọn tòa'
    if (!form.apartment.trim()) e.apartment = 'Vui lòng chọn căn hộ'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ'
    if (form.phone && !/^[0-9]{9,15}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return
    mutation.mutate()
  }

  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }))

  const addMember = () => setMembers((s) => [...s, { fullName: '', relation: '', age: '', phone: '' }])
  const removeMember = (idx: number) => setMembers((s) => s.filter((_, i) => i !== idx))
  const updateMember = (idx: number, key: string, val: string) => setMembers((s) => s.map((m, i) => (i === idx ? { ...m, [key]: val } : m)))

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold mb-4">Thêm cư dân</h1>
      {serverError && <div className="mb-3"><Alert type="error" title="Lỗi">{serverError}</Alert></div>}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input label="Họ và tên" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} error={errors.fullName} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
        <Input label="Số điện thoại" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select label="Tòa" value={form.building} onChange={(e) => { set('building', e.target.value); set('apartment', ''); }} error={errors.building}>
            <option value="">Chọn tòa…</option>
            {getBuildingOptions().map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          <Select label="Căn hộ" value={form.apartment} onChange={(e) => set('apartment', e.target.value)} error={errors.apartment}>
            <option value="">Chọn căn hộ…</option>
            {getApartmentOptions(form.building).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <Input label="Ghi chú" value={form.note} onChange={(e) => set('note', e.target.value)} />
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            />
          </div>
          <EvidenceUploader label="Ảnh căn hộ / hộ khẩu" onChange={setPhotos} />
        </div>
        <div className="space-y-2">
          <div className="text-lg font-semibold">Thành viên trong căn hộ</div>
          {members.map((m, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-white border rounded p-3">
              <Input label="Họ và tên" value={m.fullName} onChange={(e) => updateMember(idx, 'fullName', e.target.value)} />
              <Input label="Quan hệ" value={m.relation} onChange={(e) => updateMember(idx, 'relation', e.target.value)} />
              <Input label="Tuổi" value={m.age} onChange={(e) => updateMember(idx, 'age', e.target.value)} />
              <div className="flex gap-2">
                <Input label="Điện thoại" value={m.phone} onChange={(e) => updateMember(idx, 'phone', e.target.value)} className="flex-1" />
                <Button type="button" variant="secondary" onClick={() => removeMember(idx)}>Xóa</Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addMember}>Thêm thành viên</Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending} className="py-3 px-5 text-base">{mutation.isPending ? 'Đang lưu…' : 'Lưu'}</Button>
          <Button type="button" variant="secondary" onClick={() => history.back()} className="py-3 px-5 text-base">Hủy</Button>
        </div>
      </form>
    </div>
  )
}
