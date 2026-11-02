import { request } from './client.ts'
import type { ResourceErrors } from './errors.ts'

export interface LoginRequest {
  username: string
  password: string
}
export interface CurrentUser {
  id: string
  role: 'ADMIN' | 'CLIENT'
}

export function getCurrentUser(): Promise<CurrentUser> {
  return request<CurrentUser>('/auth/me', authErrors, {
    cache: 'no-store',
  })
}


const authErrors: ResourceErrors = {
  fields: ['username', 'password'],
  notFoundMessage: 'Authentication endpoint not found.',
}
const loginErrors: ResourceErrors = {
  ...authErrors,
  unauthorizedMessage: 'Invalid username or password.',
}
export function login(
  credentials: LoginRequest
): Promise<void> {
  return request<void>('/auth/login', loginErrors, {
    method: 'POST',
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
}

export function logout(): Promise<void> {
  return request<void>('/auth/logout', authErrors, {
    method: 'POST',
  })
}