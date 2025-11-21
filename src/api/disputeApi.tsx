import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { Dispute } from "../types/disputes";
import type { ApiResponseDetail } from "./vehicleApi";



export const getDisputes = async (): Promise<Dispute[]> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Disputes`
    );
    const response = rawResponse as ApiResponseDetail<Dispute[]>;
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

export const sendMessage = async (disputeId: number, message: string): Promise<Dispute> => {
  try {
    const rawResponse = await axiosClient.post(
      `/groups/api/Disputes/${disputeId}/message`,message 
    );
    const response = rawResponse as ApiResponseDetail<Dispute>;
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

export const getDisputeById = async (disputeId: number): Promise<Dispute> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Disputes/${disputeId}`
    );
    const response = rawResponse as ApiResponseDetail<Dispute>;
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

export const resolveDispute = async (disputeId: number): Promise<Dispute> => {
  try {
    const rawResponse = await axiosClient.put(
      `/groups/api/Disputes/${disputeId}/resolve`
    );
    const response = rawResponse as ApiResponseDetail<Dispute>;
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

