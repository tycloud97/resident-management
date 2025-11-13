import { useEffect, useState } from 'react'

type FileItem = { file: File; preview: string }

type Props = {
  label?: string
  multiple?: boolean
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

export default function EvidenceUploader({ label = 'Ảnh minh chứng', multiple = true, onChange, maxFiles = 5, maxSizeMB = 5 }: Props) {
  const [items, setItems] = useState<FileItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    onChange(items.map((i) => i.file))
  }, [items])

  const handleSelect: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setError(null)
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (items.length + files.length > maxFiles) {
      setError(`Tối đa ${maxFiles} ảnh.`)
      return
    }
    const next: FileItem[] = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        setError('Chỉ chấp nhận hình ảnh')
        continue
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`Mỗi ảnh tối đa ${maxSizeMB}MB`)
        continue
      }
      const preview = URL.createObjectURL(f)
      next.push({ file: f, preview })
    }
    setItems((s) => [...s, ...next])
    e.currentTarget.value = ''
  }

  const removeAt = (idx: number) => {
    setItems((s) => {
      const cp = s.slice()
      const it = cp[idx]
      if (it) URL.revokeObjectURL(it.preview)
      cp.splice(idx, 1)
      return cp
    })
  }

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">{label}</label>
      <input type="file" accept="image/*" multiple={multiple} onChange={handleSelect} className="block" />
      {error && <div className="text-sm text-red-600">{error}</div>}
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {items.map((it, idx) => (
            <div key={idx} className="relative group">
              <img src={it.preview} alt={`Ảnh minh chứng ${idx + 1}`} className="w-full h-24 object-cover rounded border" />
              <button type="button" aria-label="Xóa ảnh" className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100" onClick={() => removeAt(idx)}>Xóa</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

