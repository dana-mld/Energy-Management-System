export interface Device {
  id: string;
  name: string;
  maximum_consumption: number;
  description: string;
  userId: string | null;
}

export interface NewDevice {
  name: string;
  maximum_consumption: number;
  description: string;
  userId: string | null;
}

export type FormField = keyof NewDevice
