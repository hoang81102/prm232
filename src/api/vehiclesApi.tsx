// src/api/vehiclesApi.tsx
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

// =========================
// Kiểu response chung của BE
// =========================
interface ApiResponse<T> {
  success: boolean;
  errorCode?: string | null;
  message?: string | null;
  data?: T;
}

// =========================
// Kiểu dữ liệu Vehicle
// =========================

export type VehicleStatus = "Active" | "Inactive" | string;

export interface Vehicle {
  vehicleId: number;
  licensePlate: string;
  vin: string;
  make: string;
  model: string;
  color: string;
  batteryCapacityKWh: number;
  status: VehicleStatus;
  coOwnerGroupId: number;

  year?: number;
  chargingPortType?: string;
  purchasePrice?: number;
}

export interface CreateVehiclePayload {
  licensePlate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  batteryCapacityKWh: number;
  chargingPortType: string;
  coOwnerGroupId: number;
  purchasePrice: number;
}

// =========================
// POST /vehicles/api/Vehicles  (Thêm xe mới)
// =========================
export const createVehicle = async (
  payload: CreateVehiclePayload
): Promise<Vehicle> => {
  try {
    // axiosClient đã có interceptor -> trả về response.data
    const res = (await axiosClient.post(
      "/vehicles/api/Vehicles",
      payload
    )) as ApiResponse<Vehicle>;

    if (!res.success || !res.data) {
      const msg = res.message ?? "Thêm xe mới thất bại!";
      toast.error(msg);
      throw new Error(msg);
    }

    toast.success(res.message ?? "Thêm xe mới thành công!");
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      (error.response?.data as any)?.message || "Thêm xe mới thất bại!";
    toast.error(msg);
    throw err;
  }
};

// =========================
// GET /vehicles/api/Vehicles/by-group/{groupId}
// =========================
export const getVehiclesByGroup = async (
  groupId: number
): Promise<Vehicle[]> => {
  try {
    const res = (await axiosClient.get(
      `/vehicles/api/Vehicles/by-group/${groupId}`
    )) as ApiResponse<Vehicle[]>;

    if (!res.success || !res.data) {
      const msg = res.message ?? "Lấy danh sách xe thất bại!";
      toast.error(msg);
      return [];
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      (error.response?.data as any)?.message ||
      "Lấy danh sách xe theo nhóm thất bại!";
    toast.error(msg);
    return [];
  }
};
