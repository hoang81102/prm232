
export interface Vehicle {
  vehicleId: number;
  contractId: number | null;
  licensePlate: string;
  vin: string;
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  batteryCapacityKwh: number | null;
  chargingPortType: string | null;
  purchaseDate: string | null;
  purchasePrice: number | null;
  coOwnerGroupId: number | null;
  status: VehicleStatus;
}

export const VehicleStatus = {
  Available: 0,
  InUse: 1,
  Maintenance: 2,
  Inactive: 3,
  Active: 4,
} as const;

export type VehicleStatus = typeof VehicleStatus[keyof typeof VehicleStatus];