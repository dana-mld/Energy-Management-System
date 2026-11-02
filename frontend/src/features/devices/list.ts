
import type { Device } from './types.ts'

export type SortField = 'name' | 'maximum_consumption'
export type SortOrder = 'asc' | 'desc'

export function filterAndSort(
  devices: Device[],
  search: string,
  field: SortField,
  order: SortOrder,
): Device[] {
  const term = search.trim().toLowerCase()

  const matches = devices.filter((device) =>
    device.name.toLowerCase().includes(term)
  )

  matches.sort((a, b) => {
    if (field === 'maximum_consumption') {
      return a.maximum_consumption - b.maximum_consumption
    }

    return a.name.localeCompare(b.name, undefined, {
      sensitivity: 'base',
    })
  })

  return order === 'asc' ? matches : matches.reverse()
}
