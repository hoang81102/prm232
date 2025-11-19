import axiosClient from "./axiosClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

// =========================
// Kiểu dữ liệu chung
// =========================
export interface Booking {
  bookingId: number;
  vehicleId: number;
  userId: number;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface CreateBookingPayload {
  vehicleId: number;
  startTime: string; // ISO string, ví dụ: "2025-11-20T18:05:30.285Z"
  endTime: string; // ISO string
}

interface BaseApiResponse<T> {
  success: boolean;
  errorCode?: string | null;
  message?: string | null;
  data: T;
}

// =========================
// ✅ ĐẶT LỊCH XE (POST /bookings/api/Bookings)
// =========================
export const createBooking = async (
  payload: CreateBookingPayload
): Promise<Booking | null> => {
  try {
    const res = (await axiosClient.post(
      "/bookings/api/Bookings",
      payload
    )) as BaseApiResponse<Booking>;

    console.log("Create booking response:", res);

    if (res.success) {
      toast.success(res.message || "Đặt xe thành công!");
      return res.data;
    } else {
      toast.error(res.message || "Đặt xe thất bại!");
      return null;
    }
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("CREATE BOOKING ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Không đặt được xe. Vui lòng thử lại!";
    toast.error(msg);

    return null;
  }
};

// =========================
// ✅ LỊCH SỬ ĐẶT CÁ NHÂN
// (GET /bookings/api/Bookings/mine)
// =========================
export const getMyBookings = async (): Promise<Booking[]> => {
  try {
    const res = (await axiosClient.get(
      "/bookings/api/Bookings/mine"
    )) as BaseApiResponse<Booking[]>;

    console.log("My bookings response:", res);

    if (!res.success) {
      toast.error(res.message || "Không lấy được lịch sử đặt xe!");
      return [];
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("GET MY BOOKINGS ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Không lấy được lịch sử đặt xe. Vui lòng thử lại!";
    toast.error(msg);

    return [];
  }
};
