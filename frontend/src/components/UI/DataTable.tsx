import StatusBadge from './StatusBadge'

type Column<T> = {
  header: string
  accessor: (row: T) => React.ReactNode
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  caption?: string
}

export default function DataTable<T>({ columns, data, caption }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded" role="table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 ? 'bg-white' : 'bg-gray-50/50'}>
              {columns.map((col, cIdx) => (
                <td key={cIdx} className="px-3 py-2 text-sm text-gray-700 border-b">
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td className="px-3 py-4 text-sm text-gray-500" colSpan={columns.length}>Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export { StatusBadge }
