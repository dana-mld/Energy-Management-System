import type { FieldErrors } from '../../shared/api/types.ts'
import type { NewPerson, UpdatePerson, UserRole } from './types.ts'

export interface ProfileFormValues {
  name: string
  address: string
  age: string
}

export interface FormValues extends ProfileFormValues {
  username: string
  password: string
  role: UserRole
}

const MAX_LENGTH = 255
const MINIMUM_AGE = 18

export function validateProfile(
  values: ProfileFormValues
): FieldErrors {
  const errors: FieldErrors = {}

  for (const field of ['name', 'address'] as const) {
    const value = values[field].trim()

    if (value === '') {
      errors[field] = 'This field is required.'
    } else if (value.length > MAX_LENGTH) {
      errors[field] = `At most ${MAX_LENGTH} characters are allowed.`
    }
  }

  const age = values.age.trim()

  if (!/^\d+$/.test(age)) {
    errors.age = 'Enter a whole number.'
  } else if (Number(age) <= MINIMUM_AGE) {
    errors.age = `The age must be greater than ${MINIMUM_AGE}.`
  }

  return errors
}

export function validate(values: FormValues): FieldErrors {
  const errors = validateProfile(values)

  if (values.username.trim() === '') {
    errors.username = 'This field is required.'
  } else if (values.username.trim().length > MAX_LENGTH) {
    errors.username = `At most ${MAX_LENGTH} characters are allowed.`
  }

  if (values.password.trim() === '') {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must contain at least 8 characters.'
  } else if (new TextEncoder().encode(values.password).length > 72) {
    errors.password = 'Password must not exceed 72 UTF-8 bytes.'
  }

  if (values.role !== 'ADMIN' && values.role !== 'CLIENT') {
    errors.role = 'Choose ADMIN or CLIENT.'
  }

  return errors
}

export function toUpdatePerson(
  values: ProfileFormValues
): UpdatePerson {
  return {
    name: values.name.trim(),
    address: values.address.trim(),
    age: Number(values.age.trim()),
  }
}

export function toNewPerson(values: FormValues): NewPerson {
  return {
    ...toUpdatePerson(values),
    username: values.username.trim(),
    password: values.password,
    role: values.role,
  }
}