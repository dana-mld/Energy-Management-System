import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PersonListPage from './PersonListPage.tsx'

function renderPage() {
  render(
    <MemoryRouter>
      <PersonListPage />
    </MemoryRouter>,
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('PersonListPage', () => {
  it('shows the loading state, then the persons', async () => {
    const people = [{ id: '19e0cd8c-573e-436c-8f3b-90154459148e', name: 'John', age: 22 }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(people), { status: 200 })))
    renderPage()
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
    expect(await screen.findByText('John')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', `/person/${people[0].id}`)
  })

  it('shows a message when the list is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]', { status: 200 })))
    renderPage()
    expect(await screen.findByText('No persons yet')).toBeInTheDocument()
  })

  it('shows an error when the backend cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('cannot be reached')
  })
})
