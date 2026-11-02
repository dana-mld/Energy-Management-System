import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { Device } from '../types.ts'
import DeviceTable from './DeviceTable.tsx'

const device: Device = {
  id: '19e0cd8c-573e-436c-8f3b-90154459148e',
  name: 'Temperature Sensor',
  maximum_consumption: 125.5,
  description: 'Measures room temperature',
  userId: '29e0cd8c-573e-436c-8f3b-90154459148e',
}

describe('DeviceTable', () => {
  it('shows the backend device fields', () => {
    render(
      <MemoryRouter>
        <DeviceTable devices={[device]} />
      </MemoryRouter>,
    )

    expect(screen.getByText(device.name)).not.toBeNull()
    expect(screen.getByText('Maximum consumption')).not.toBeNull()
    expect(screen.getByText('125.5')).not.toBeNull()
    expect(screen.getByText(device.description)).not.toBeNull()
    expect(screen.getByText(device.userId as string)).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Details' }).getAttribute('href'))
      .toBe(`/devices/${device.id}`)
  })

  it('indicates an unassigned user', () => {
    render(
      <MemoryRouter>
        <DeviceTable devices={[{ ...device, userId: null }]} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Not assigned')).not.toBeNull()
  })
})
