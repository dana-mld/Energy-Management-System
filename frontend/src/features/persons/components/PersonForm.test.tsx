import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../shared/api/errors.ts'
import type { NewPerson } from '../types.ts'
import PersonForm from './PersonForm.tsx'

function renderForm(onSubmit: (person: NewPerson) => Promise<void>) {
  render(
    <MemoryRouter>
      <PersonForm onSubmit={onSubmit} />
    </MemoryRouter>,
  )
}

async function fill(name: string, address: string, age: string) {
  const user = userEvent.setup()
  if (name) await user.type(screen.getByLabelText('Name'), name)
  if (address) await user.type(screen.getByLabelText('Address'), address)
  if (age) await user.type(screen.getByLabelText('Age'), age)
  await user.click(screen.getByRole('button', { name: 'Create person' }))
}

describe('PersonForm', () => {
  it('shows validation errors and does not submit', async () => {
    const onSubmit = vi.fn()
    renderForm(onSubmit)
    await fill('', '', '17')
    expect(screen.getAllByText('This field is required.')).toHaveLength(2)
    expect(screen.getByText('The age must be greater than 18.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits trimmed values as a NewPerson', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)
    await fill(' John ', 'Somewhere Else street', '22')
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', address: 'Somewhere Else street', age: 22 })
  })

  it('shows errors reported by the server', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError('The server rejected the submitted data.', 400, { age: 'Rejected by server' }))
    renderForm(onSubmit)
    await fill('John', 'Somewhere', '22')
    expect(await screen.findByText('Rejected by server')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('The server rejected the submitted data.')
    expect(screen.getByRole('button', { name: 'Create person' })).toBeEnabled()
  })
})
