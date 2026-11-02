import { networkError, toApiError } from './errors.ts'
import type { ResourceErrors } from './errors.ts'
import { notifyUnauthorized } from './authEvents.ts'
const BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL ?? '/api'
).replace(/\/+$/, '')

export async function request<T>(path: string, resource: ResourceErrors, init?: RequestInit): Promise<T> {
  let response: Response
  try {
response = await fetch(`${BASE_URL}${path}`, {
  ...init,
  credentials: 'include', 
})  } catch {
    throw networkError()
  }
  if (!response.ok) {
  if (response.status === 401 && path !== '/auth/login') {
    notifyUnauthorized()
  }

  throw await toApiError(response, resource)
}
  if (response.status === 204) {
  return undefined as T
}

return response.json()
}
