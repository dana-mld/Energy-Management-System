import type { FieldErrors } from './types.ts'

export class ApiError extends Error {
  status: number | null
  fieldErrors: FieldErrors

  constructor(message: string, status: number | null, fieldErrors: FieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function networkError(): ApiError {
  return new ApiError('The server cannot be reached. Check that the backend is running.', null)
}

export interface ResourceErrors {
  fields: readonly string[]
  notFoundMessage: string
    unauthorizedMessage?: string

}

function parseDetails(details: unknown[], fields: readonly string[]): FieldErrors {
  const fieldErrors: FieldErrors = {}
  for (const detail of details) {
    if (typeof detail !== 'string') continue
    const separator = detail.indexOf(':')
    if (separator < 0) continue
    const field = detail.slice(0, separator).trim()
    const message = detail.slice(separator + 1).replace(/\s+/g, ' ').trim()
    if (fields.includes(field) && !(field in fieldErrors)) {
      fieldErrors[field] = message
    }
  }
  return fieldErrors
}

export async function toApiError(response: Response, resource: ResourceErrors): Promise<ApiError> {
  let body: unknown = null
  try {
    body = await response.json()
  } catch {}

  const details = (body as { details?: unknown } | null)?.details
  if (Array.isArray(details)) {
    const fieldErrors = parseDetails(details, resource.fields)
    if (Object.keys(fieldErrors).length > 0) {
      return new ApiError(
        'The server rejected the submitted data.',
        response.status,
        fieldErrors,
      )
    }
  }
  if (response.status === 401) {
  return new ApiError(
    resource.unauthorizedMessage
      ?? 'Authentication is required or has expired. Please log in.',
    401,
  )
}

if (response.status === 403) {
  return new ApiError(
    'Access denied. You do not have permission, or the request origin is not allowed.',
    403,
  )
}
  if (response.status === 404) {
    return new ApiError(resource.notFoundMessage, 404)
  }
  return new ApiError(
    `The server could not process the request (HTTP ${response.status}).`,
    response.status,
  )
}
