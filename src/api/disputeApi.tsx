// src/api/disputeApi.tsx
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

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

  messages?: DisputeMessage[];
}

// =========================
// Payload tạo khiếu nại
// =========================
export interface CreateDisputePayload {
  coOwnerGroupId: number;
  title: string;
  description: string;
  relatedBookingId?: number | null;
}

// =========================
// Helper chung
// =========================
const getErrorMessage = (err: unknown, fallback: string): string => {
  const error = err as AxiosError<any>;
  return error?.response?.data?.message || fallback;
};

// ❗ axiosClient đã trả về response.data
// nên unwrapResponse nhận trực tiếp ApiResponse<T>
const unwrapResponse = <T,>(res: ApiResponse<T>): T => {
  return res.data;
};

// ======================================================
// ✅ 1) Lấy danh sách khiếu nại theo group
//     GET /groups/api/Disputes/group/{groupId}
// ======================================================
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

// ======================================================
// ✅ 2) Tạo khiếu nại — POST /groups/api/Disputes
// ======================================================
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
// ✅ 3) Lấy chi tiết khiếu nại — GET /groups/api/Disputes/{id}
// ======================================================
export const getDisputeById = async (id: number): Promise<Dispute> => {
  try {
    const res = await axiosClient.get<
      ApiResponse<Dispute>,
      ApiResponse<Dispute>
    >(`/groups/api/Disputes/${id}`);

    return unwrapResponse(res);
  } catch (err) {
    const msg = getErrorMessage(err, "Không tải được chi tiết khiếu nại!");
    toast.error(msg);
    throw err;
  }
};
