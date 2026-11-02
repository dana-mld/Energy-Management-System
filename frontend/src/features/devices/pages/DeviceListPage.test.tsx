
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DeviceListPage from './DeviceListPage.tsx'

function renderPage() {
  render(
    <MemoryRouter>
      <DeviceListPage />
    </MemoryRouter>,
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('DeviceListPage', () => {
  it('shows the loading state, then the devices', async () => {
    const devices = [
      {
        id: '19e0cd8c-573e-436c-8f3b-90154459148e',
        name: 'Temperature Sensor',
        maximum_consumption: 125.5,
        description: 'Measures room temperature',
        userId: '29e0cd8c-573e-436c-8f3b-90154459148e',
      },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(devices), { status: 200 }),
      ),
    )

    renderPage()

    expect(screen.getByRole('status').textContent).toContain('Loading')

    expect(
      await screen.findByText('Temperature Sensor')
    ).not.toBeNull()

    expect(screen.getByText('125.5')).not.toBeNull()
    expect(screen.getByText('Measures room temperature')).not.toBeNull()

    expect(
      screen.getByRole('link', { name: 'Details' }).getAttribute('href')
    ).toBe(`/devices/${devices[0].id}`)
  })

  it('shows a message when the list is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('[]', { status: 200 }),
      ),
    )

    renderPage()

    expect(
      await screen.findByText('No devices yet')
    ).not.toBeNull()
  })

  it('shows an error when the backend cannot be reached', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(
        new TypeError('Failed to fetch'),
      ),
    )

    renderPage()

    expect(
      (await screen.findByRole('alert')).textContent
    ).toContain('cannot be reached')
  })

  it('provides links to create a new device', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('[]', { status: 200 }),
      ),
    )

    renderPage()

    await screen.findByText('No devices yet')

    const links = screen.getAllByRole('link', {
      name: 'New Device',
    })

    expect(links).toHaveLength(2)

    links.forEach((link) => {
      expect(link.getAttribute('href')).toBe('/devices/new')
    })
  })
})
