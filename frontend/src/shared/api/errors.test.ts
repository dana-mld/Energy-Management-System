import { describe, expect, it } from 'vitest'
import { networkError, toApiError } from './errors.ts'

const resource = {
  fields: ['name', 'address', 'age'],
  notFoundMessage: 'The requested person does not exist.',
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status })
}

describe('toApiError', () => {
  it('maps validation details to field errors', async () => {
    const response = jsonResponse(
      {
        resource: 'personDTO',
        error: 'Bad Request',
        status: 400,
        message: 'MethodArgumentNotValidException',
        details: ['age:Age  does not match the required adult limit', 'address:must not be null'],
        path: 'uri=/spring-demo/person',
      },
      400,
    )
    const error = await toApiError(response, resource)
    expect(error.status).toBe(400)
    expect(error.fieldErrors).toEqual({
      age: 'Age does not match the required adult limit',
      address: 'must not be null',
    })
  })

  it('reports a missing resource with the message the caller provides', async () => {
    const response = jsonResponse(
      {
        resource: 'Person with id: 00000000-0000-0000-0000-000000000000',
        error: 'Not Found',
        status: 404,
        message: 'Resource not found!',
        details: [],
      },
      404,
    )
    const error = await toApiError(response, resource)
    expect(error.status).toBe(404)
    expect(error.message).toBe('The requested person does not exist.')
    expect(error.fieldErrors).toEqual({})
  })

  it('handles a problem+json body', async () => {
    const response = jsonResponse(
      { detail: 'Failed to read request', instance: '/spring-demo/person', status: 400, title: 'Bad Request' },
      400,
    )
    const error = await toApiError(response, resource)
    expect(error.status).toBe(400)
    expect(error.fieldErrors).toEqual({})
    expect(error.message).toContain('HTTP 400')
  })

  it('handles the default server error body', async () => {
    const response = jsonResponse({ status: 500, error: 'Internal Server Error', path: '/spring-demo/person' }, 500)
    const error = await toApiError(response, resource)
    expect(error.status).toBe(500)
    expect(error.message).toContain('HTTP 500')
  })

  it('handles a body that is not JSON', async () => {
    const error = await toApiError(new Response('Bad Gateway', { status: 502 }), resource)
    expect(error.status).toBe(502)
  })
})

describe('networkError', () => {
  it('has no status', () => {
    expect(networkError().status).toBeNull()
  })
})
