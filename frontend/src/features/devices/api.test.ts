
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../shared/api/errors.ts'
import { createDevice, getDevice, listDevices } from './api.ts'

const BASE = 'http://localhost'

const DEVICE_ID = '19e0cd8c-573e-436c-8f3b-90154459148e'
const USER_ID = '29e0cd8c-573e-436c-8f3b-90154459148e'

const device = {
  id: DEVICE_ID,
  name: 'Temperature Sensor',
  maximum_consumption: 125.5,
  description: 'Measures room temperature',
  userId: USER_ID,
}

function stubFetch(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error
      ? Promise.reject(response)
      : Promise.resolve(response),
  )

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => vi.unstubAllGlobals())

describe('Devices API', () => {
  it('lists devices', async () => {
    const devices = [device]

    const fetchMock = stubFetch(
      new Response(JSON.stringify(devices), { status: 200 }),
    )

    await expect(listDevices()).resolves.toEqual(devices)

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/devices`,
      undefined,
    )
  })

  it('gets one device by identifier', async () => {
    const fetchMock = stubFetch(
      new Response(JSON.stringify(device), { status: 200 }),
    )

    await expect(getDevice(device.id)).resolves.toEqual(device)

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/devices/${device.id}`,
      undefined,
    )
  })

  it('creates a device and returns the identifier', async () => {
    const fetchMock = stubFetch(
      new Response(JSON.stringify(DEVICE_ID), { status: 201 }),
    )

    const input = {
      name: 'Temperature Sensor',
      maximum_consumption: 125.5,
      description: 'Measures room temperature',
      userId: USER_ID,
    }

    await expect(createDevice(input)).resolves.toBe(DEVICE_ID)

    expect(fetchMock).toHaveBeenCalledWith(`${BASE}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  })

  it('throws an ApiError with field errors when the server rejects the data', async () => {
    stubFetch(
      new Response(
        JSON.stringify({
          status: 400,
          details: ['name:Name must not be blank'],
        }),
        { status: 400 },
      ),
    )

    const error = await createDevice({
      name: '',
      maximum_consumption: 125.5,
      description: 'Temperature sensor',
      userId: USER_ID,
    }).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)

    expect((error as ApiError).fieldErrors.name)
      .toBe('Name must not be blank')
  })

  it('reports a missing device', async () => {
    stubFetch(
      new Response(
        JSON.stringify({ details: [] }),
        { status: 404 },
      ),
    )

    const error = await getDevice(
      '00000000-0000-0000-0000-000000000000',
    ).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(404)
    expect((error as ApiError).message)
      .toBe('The requested Device does not exist.')
  })

  it('throws an ApiError without status when the server is unreachable', async () => {
    stubFetch(new TypeError('Failed to fetch'))

    const error = await listDevices().catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBeNull()
  })
})
