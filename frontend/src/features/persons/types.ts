export type UserRole = 'ADMIN' | 'CLIENT'
export interface AccountDetails {
  username: string
  role: UserRole
}


export interface Person {
  id: string
  name: string
  address: string
  age: number
}


export interface NewPerson {
  name: string
  address: string
  age: number
  username: string
  password: string
  role: UserRole
}
export type FormField = keyof NewPerson
export type UpdatePerson = Pick<
  Person,
  'name' | 'address' | 'age'
>