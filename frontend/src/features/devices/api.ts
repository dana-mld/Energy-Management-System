import { request } from '../../shared/api/client.ts'
import type { NewDevice, Device } from './types.ts'

const DeviceErrors = {
  fields: ['name', 'maximum_consumption', 'description', 'userId'],
  notFoundMessage: 'The requested Device does not exist.',
}

export function listDevices(): Promise<Device[]> {
  return request<Device[]>('/devices', DeviceErrors)
}

export function getDevice(id: string): Promise<Device> {
  return request<Device>(`/devices/${encodeURIComponent(id)}`, DeviceErrors)
}
export function listMyDevices(): Promise<Device[]> {
  return request<Device[]>('/devices/me', DeviceErrors)
}
export function createDevice(device: NewDevice): Promise<string> {
  return request<string>('/devices', DeviceErrors, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(device),
  })
}
export function deleteDevice(id: string): Promise<void> {
  return request<void>(
    `/devices/${encodeURIComponent(id)}`,
    DeviceErrors,
    { method: 'DELETE' }
  )
}

export function updateDevice(
  id: string,
  device: NewDevice
): Promise<Device> {
  return request<Device>(
    `/devices/${encodeURIComponent(id)}`,
    DeviceErrors,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device),
    }
  )
}