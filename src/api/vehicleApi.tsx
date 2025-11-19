import type { AxiosError } from "axios";
import type { ApiResponse } from "./authApi";
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { Vehicle } from "../types/vehicle";
import type { VehicleFormValues } from "../components/vehicle/VehicleForm";

export interface ApiResponseDetail<T> {
  data: T;
  message?: string;
  errorCode?: string;
  success?: boolean;
}
export const getVehiclesByGroup = async (groupId: number): Promise<Vehicle[]> => {
  try {
    const rawResponse = await axiosClient.get(
      `/vehicles/api/Vehicles/by-group/${groupId}`
    );
    const response = rawResponse as ApiResponse<any>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH ME ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get profile!";
    toast.error(msg);
    throw err;
  }
};

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const rawResponse = await axiosClient.get(`/vehicles/api/Vehicles`);
    const response = rawResponse as ApiResponseDetail<Vehicle[]>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH VEHICLES ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get vehicles!";
    toast.error(msg);
    throw err;
  }
};

export const getVehicle = async (vehicleId: number): Promise<Vehicle> => {
  try {
    const rawResponse = await axiosClient.get(`/vehicles/api/Vehicles/${vehicleId}`);
    const response = rawResponse as ApiResponseDetail<Vehicle>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH VEHICLES ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get vehicles!";
    toast.error(msg);
    throw err;
  }
};

export const deleteVehicle = async (vehicleId: number): Promise<Vehicle> => {
  try {
    const rawResponse = await axiosClient.delete(`/vehicles/api/Vehicles/${vehicleId}`);
    const response = rawResponse as ApiResponseDetail<Vehicle>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH VEHICLE ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get vehicle detail!";
    toast.error(msg);
    throw err;
  }
};

export const addVehicle = async (vehicle: VehicleFormValues): Promise<Vehicle> => {
  try {
    const rawResponse = await axiosClient.post(`/vehicles/api/Vehicles`, vehicle);
    const response = rawResponse as ApiResponseDetail<Vehicle>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("ADD VEHICLES ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to add vehicle!";
    toast.error(msg);
    throw err;
  }
};




