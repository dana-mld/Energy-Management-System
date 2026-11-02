
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '../../../shared/api/errors.ts'
import type { NewDevice } from '../types.ts'
import DeviceForm from './DeviceForm.tsx'

const VALID_USER_ID = '19e0cd8c-573e-436c-8f3b-90154459148e'

function renderForm(onSubmit: (device: NewDevice) => Promise<void>) {
  render(
    <MemoryRouter>
      <DeviceForm onSubmit={onSubmit} />
    </MemoryRouter>,
  )
}

async function fill(
  name: string,
  maximumConsumption: string,
  description: string,
  userId: string,
) {
  const user = userEvent.setup()

  if (name) {
    await user.type(screen.getByLabelText('Name'), name)
  }

  if (maximumConsumption) {
    await user.type(screen.getByLabelText('Maximum consumption'), maximumConsumption)
  }

  if (description) {
    await user.type(screen.getByLabelText('Description'), description)
  }

  if (userId) {
    await user.type(screen.getByLabelText('User ID'), userId)
  }

  await user.click(screen.getByRole('button', { name: 'Create Device' }))
}

describe('DeviceForm', () => {
  it('shows validation errors and does not submit', async () => {
    const onSubmit = vi.fn()
    renderForm(onSubmit)

    await fill('', '', '', '')

    expect(screen.getAllByText('This field is required.')).toHaveLength(3)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits trimmed values as a NewDevice', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    await fill(
      ' Smart Thermostat ',
      ' 125.5 ',
      ' Temperature control device ',
      VALID_USER_ID,
    )

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Smart Thermostat',
      maximum_consumption: 125.5,
      description: 'Temperature control device',
      userId: VALID_USER_ID,
    })
  })

  it('shows errors reported by the server', async () => {
    const onSubmit = vi.fn().mockRejectedValue(
      new ApiError(
        'The server rejected the submitted data.',
        400,
        { userId: 'Rejected by server' },
      ),
    )

    renderForm(onSubmit)

    await fill(
      'Smart Thermostat',
      '125',
      'Temperature control device',
      VALID_USER_ID,
    )

    expect(
      await screen.findByText('Rejected by server')
    ).not.toBeNull()

    expect(screen.getByRole('alert').textContent).toContain(
      'The server rejected the submitted data.'
    )

    expect(
      (screen.getByRole('button', { name: 'Create Device' }) as HTMLButtonElement).disabled
    ).toBe(false)
  })
})
