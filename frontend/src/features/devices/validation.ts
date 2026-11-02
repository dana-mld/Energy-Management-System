import type { FieldErrors } from '../../shared/api/types.ts'
import type { NewDevice } from './types.ts'

export interface FormValues {
  name: string
  maximum_consumption: string
  description: string
  userId: string
}

const MAX_LENGTH = 255

export function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}

  for (const field of ['name', 'description'] as const) {
    const value = values[field].trim()
    if (value === '') {
      errors[field] = 'This field is required.'
    } else if (value.length > MAX_LENGTH) {
      errors[field] = `At most ${MAX_LENGTH} characters are allowed.`
    }
  }

  const maximumConsumption = values.maximum_consumption.trim()
  if (maximumConsumption === '') {
    errors.maximum_consumption = 'This field is required.'
  } else if (!Number.isFinite(Number(maximumConsumption))) {
    errors.maximum_consumption = 'Enter a valid number.'
  }

  return errors
}

export function toNewDevice(values: FormValues): NewDevice {
  return {
    name: values.name.trim(),
    maximum_consumption: Number(values.maximum_consumption.trim()),
    description: values.description.trim(),
    userId: values.userId.trim() || null,
  }
}
