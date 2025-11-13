type Item = { id: string; url: string; alt?: string }

export default function PhotoGallery({ items }: { items: Item[] }) {
  if (!items?.length) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {items.map((it) => (
        <a key={it.id} href={it.url} target="_blank" rel="noreferrer">
          <img src={it.url} alt={it.alt || 'Ảnh'} className="w-full h-28 object-cover rounded border" />
        </a>
      ))}
    </div>
  )
}

