
import { describe, expect, it } from 'vitest'
import { filterAndSort } from './list.ts'
import type { Device } from './types.ts'

const devices: Device[] = [
  {
    id: '1',
    name: 'Smart Thermostat',
    maximum_consumption: 125.5,
    description: 'Temperature control device',
    userId: 'user-1',
  },
  {
    id: '2',
    name: 'security Camera',
    maximum_consumption: 200,
    description: 'Security monitoring device',
    userId: 'user-2',
  },
  {
    id: '3',
    name: 'Air Purifier',
    maximum_consumption: 80,
    description: 'Air quality improvement device',
    userId: 'user-3',
  },
]

const names = (list: Device[]) =>
  list.map((device) => device.name)

describe('filterAndSort', () => {
  it('sorts by device name regardless of case', () => {
    expect(names(filterAndSort(devices, '', 'name', 'asc'))).toEqual([
      'Air Purifier',
      'security Camera',
      'Smart Thermostat',
    
    ])

    expect(names(filterAndSort(devices, '', 'name', 'desc'))).toEqual([
      'Smart Thermostat',
      'security Camera',
      'Air Purifier',
    ])
  })

  it('sorts by maximum consumption numerically', () => {
    expect(
      filterAndSort(devices, '', 'maximum_consumption', 'asc')
        .map((device) => device.maximum_consumption)
    ).toEqual([80, 125.5, 200])

    expect(
      filterAndSort(devices, '', 'maximum_consumption', 'desc')
        .map((device) => device.maximum_consumption)
    ).toEqual([200, 125.5, 80])
  })

  it('filters by a case-insensitive part of the device name', () => {
    expect(
      names(filterAndSort(devices, 'SMART', 'name', 'asc'))
    ).toEqual(['Smart Thermostat'])

    expect(
      filterAndSort(devices, 'zzz', 'name', 'asc')
    ).toEqual([])
  })

  it('does not modify the input', () => {
    const copy = [...devices]

    filterAndSort(devices, '', 'maximum_consumption', 'desc')

    expect(devices).toEqual(copy)
  })
})
