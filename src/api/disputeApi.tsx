// src/api/disputeApi.ts
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

// =========================
// Kiểu response chung từ BE
// =========================
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
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
  coOwnerGroupId: number;
  title: string;
  description: string;
  relatedBookingId?: number | null;
  status?: string;
  createdAt?: string;
  createdByUserId?: number;
  messages?: DisputeMessage[];
}

// =========================
// Payloads
// =========================
export interface CreateDisputePayload {
  coOwnerGroupId: number;
  title: string;
  description: string;
  relatedBookingId?: number | null;
}

export interface SendDisputeMessagePayload {
  message: string;
}

export interface ResolveDisputePayload {
  resolutionNote: string;
}

// ======================================================
// ✅ 1) Tạo khiếu nại — POST /api/Disputes  (CoOwner)
// ======================================================
export const createDispute = async (
  payload: CreateDisputePayload
): Promise<Dispute> => {
  try {
    const res = (await axiosClient.post(
      "/api/Disputes",
      payload
    )) as ApiResponse<Dispute>;

    const data = res.data ?? (res as any).data;

    toast.success(res.message || "Đã tạo khiếu nại!");
    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg = error.response?.data?.message || "Tạo khiếu nại thất bại!";
    toast.error(msg);
    throw err;
  }
};

// ======================================================
// ✅ 2) Lấy chi tiết khiếu nại — GET /api/Disputes/{id}
// ======================================================
export const getDisputeById = async (id: number): Promise<Dispute> => {
  try {
    const res = (await axiosClient.get(
      `/api/Disputes/${id}`
    )) as ApiResponse<Dispute>;

    return res.data ?? (res as any).data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      error.response?.data?.message || "Không tải được chi tiết khiếu nại!";
    toast.error(msg);
    throw err;
  }
};

// ======================================================
// ✅ 3) Staff gửi message — POST /api/Disputes/{id}/message
// ======================================================
export const sendDisputeMessage = async (
  id: number,
  payload: SendDisputeMessagePayload
): Promise<Dispute> => {
  try {
    const res = (await axiosClient.post(
      `/api/Disputes/${id}/message`,
      payload
    )) as ApiResponse<Dispute>;

    toast.success(res.message || "Đã gửi tin nhắn!");
    return res.data ?? (res as any).data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg = error.response?.data?.message || "Gửi tin nhắn thất bại!";
    toast.error(msg);
    throw err;
  }
};

// ======================================================
// ✅ 4) Staff giải quyết tranh chấp — PUT /api/Disputes/{id}/resolve
// ======================================================
export const resolveDispute = async (
  id: number,
  payload: ResolveDisputePayload
): Promise<Dispute> => {
  try {
    const res = (await axiosClient.put(
      `/api/Disputes/${id}/resolve`,
      payload
    )) as ApiResponse<Dispute>;

    toast.success(res.message || "Đã giải quyết tranh chấp!");
    return res.data ?? (res as any).data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const msg =
      error.response?.data?.message || "Giải quyết tranh chấp thất bại!";
    toast.error(msg);
    throw err;
  }
};
