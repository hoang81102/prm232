import type { AxiosError } from "axios";
import type { ApiResponse } from "./authApi";
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { Vehicle } from "../types/vehicle";

export interface ApiResponseDetail<T> {
  data: T[];
  message?: string;
  errorCode?: string;
  success?: boolean;
}
export const getVehiclesByGroup = async (groupId: number): Promise<any> => {
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
