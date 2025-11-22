import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { ApiResponseDetail } from "./vehicleApi";
import type { DisputeSchema } from "../types/disputes";
// =========================
// Kiểu response chung từ BE
// =========================
interface ApiResponse<T> {
  success: boolean;
  errorCode?: string | null;
  message?: string | null;
  data: T;
}

// =========================
// Kiểu dữ liệu Dispute
// =========================

export interface DisputeMessage {
  disputeMessageId?: number;
  disputeId?: number;
  senderUserId?: number;
  message: string;
  createdAt?: string;
}

export interface Dispute {
  disputeId: number;
  coOwnerGroupId?: number;
  title: string;
  description?: string;
  relatedBookingId?: number | null;
  status?: string;
  createdAt?: string;
  raisedByUserId?: number;
  createdByUserId?: number;
}

export const getDisputes = async (): Promise<DisputeSchema[]> => {
  try {
    const rawResponse = await axiosClient.get(`/groups/api/Disputes`);
    const response = rawResponse as ApiResponseDetail<DisputeSchema[]>;
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

// =========================
// Payload tạo khiếu nại
// =========================
export interface CreateDisputePayload {
  coOwnerGroupId: number;
  title: string;
  description: string;
  relatedBookingId?: number | null;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  const error = err as AxiosError<any>;
  return error?.response?.data?.message || fallback;
};

const unwrapResponse = <T,>(res: ApiResponse<T>): T => {
  return res.data;
};

export const sendMessage = async (
  disputeId: number,
  message: string
): Promise<Dispute> => {
  try {
    const rawResponse = await axiosClient.post(
      `/groups/api/Disputes/${disputeId}/message`,
      message
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
export const getDisputesByGroup = async (
  groupId: number
): Promise<Dispute[]> => {
  try {
    // 👇 R = ApiResponse<Dispute[]> để TS hiểu đúng kiểu trả về
    const res = await axiosClient.get<
      ApiResponse<Dispute[]>,
      ApiResponse<Dispute[]>
    >(`/groups/api/Disputes/group/${groupId}`);

    return unwrapResponse(res);
  } catch (err) {
    const msg = getErrorMessage(err, "Không tải được danh sách khiếu nại!");
    toast.error(msg);
    throw err;
  }
};

export const createDispute = async (
  payload: CreateDisputePayload
): Promise<Dispute> => {
  try {
    const res = await axiosClient.post<
      ApiResponse<Dispute>,
      ApiResponse<Dispute>
    >("/groups/api/Disputes", payload);

    toast.success(res.message || "Đã tạo khiếu nại!");
    return unwrapResponse(res);
  } catch (err) {
    const msg = getErrorMessage(err, "Tạo khiếu nại thất bại!");
    toast.error(msg);
    throw err;
  }
};

// ======================================================
// ✅ 2) Tạo khiếu nại — POST /groups/api/Disputes
// ======================================================
export const getDisputeById = async (disputeId: number): Promise<DisputeSchema> => {
  try {
    const rawResponse = await axiosClient.get(
      `/groups/api/Disputes/${disputeId}`
    );
    const response = rawResponse as ApiResponseDetail<DisputeSchema>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg = getErrorMessage(err, "Tạo khiếu nại thất bại!");
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
