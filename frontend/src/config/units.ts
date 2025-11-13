export type Building = {
  id: string
  name: string
  apartments: string[]
}

// Danh sách cố định các tòa và căn hộ
export const BUILDINGS: Building[] = [
  { id: 'A', name: 'Tòa A', apartments: ['101', '102', '103', '201', '202', '203', '301', '302', '303'] },
  { id: 'B', name: 'Tòa B', apartments: ['101', '102', '201', '202', '301', '302'] },
  { id: 'C', name: 'Tòa C', apartments: ['101', '102', '103', '104', '201', '202', '203', '204'] },
]

export function getBuildingOptions() {
  return BUILDINGS.map((b) => ({ value: b.id, label: b.name }))
}

export function getApartmentOptions(buildingId?: string) {
  const b = BUILDINGS.find((x) => x.id === buildingId)
  if (!b) return []
  return b.apartments.map((a) => ({ value: a, label: `${buildingId}-${a}` }))
}

