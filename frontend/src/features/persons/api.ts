import { request } from '../../shared/api/client.ts'
import type { AccountDetails, NewPerson, Person, UpdatePerson } from './types.ts'

const personErrors = {
  fields: ['name', 'address', 'age'],
  notFoundMessage: 'The requested person does not exist.',
}

export function listPersons(): Promise<Person[]> {
  return request<Person[]>('/person', personErrors)
}

export function getPerson(id: string): Promise<Person> {
  return request<Person>(`/person/${encodeURIComponent(id)}`, personErrors)
}
export function getCurrentPerson(): Promise<Person> {
  return request<Person>('/person/me', personErrors)
}
export function createPerson(person: NewPerson): Promise<string> {
  return request<string>('/person', personErrors, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person),
  })
}

export function deletePerson(id: string): Promise<void> {
  return request<void>(
    `/person/${encodeURIComponent(id)}`,
    personErrors,
    { method: 'DELETE' }
  )
}

export function updatePerson(
  id: string,
  person: UpdatePerson
): Promise<Person> {
  return request<Person>(
    `/person/${encodeURIComponent(id)}`,
    personErrors,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    }
  )
}
const accountErrors = {
  fields: ['username', 'role'],
  notFoundMessage: 'The requested user profile or account does not exist.',
}

export function getAccountDetails(id: string): Promise<AccountDetails> {
  return request<AccountDetails>(
    `/person/${encodeURIComponent(id)}/account`,
    accountErrors,
    { cache: 'no-store' }
  )
}

export function updateAccount(
  id: string,
  account: AccountDetails
): Promise<void> {
  return request<void>(
    `/person/${encodeURIComponent(id)}/account`,
    accountErrors,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    }
  )
}
