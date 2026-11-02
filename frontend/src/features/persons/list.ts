import type { Person } from './types.ts'

export type SortField = 'name' | 'age'
export type SortOrder = 'asc' | 'desc'

export function filterAndSort(
  persons: Person[],
  search: string,
  field: SortField,
  order: SortOrder,
): Person[] {
  const term = search.trim().toLowerCase()
  const matches = persons.filter((person) => person.name.toLowerCase().includes(term))

  matches.sort((a, b) => {
    if (field === 'age') return a.age - b.age
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })
  return order === 'asc' ? matches : matches.reverse()
}
