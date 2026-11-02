export type FieldErrors = Partial<Record<string, string>>

export type RequestState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
