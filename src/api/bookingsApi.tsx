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
  startTime: string;
  endTime: string;
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

// =========================
// ✅ LỊCH XE THEO XE
// (GET /bookings/api/Bookings/vehicle/{vehicleId}/calendar?from=&to=)
// =========================
export const getVehicleCalendar = async (
  vehicleId: number,
  params?: { from?: string; to?: string } // ISO date-time
): Promise<Booking[]> => {
  try {
    const res = (await axiosClient.get(
      `/bookings/api/Bookings/vehicle/${vehicleId}/calendar`,
      {
        params: {
          from: params?.from,
          to: params?.to,
        },
      }
    )) as BaseApiResponse<Booking[]>;

    console.log("Vehicle calendar response:", res);

    if (!res.success) {
      toast.error(res.message || "Không lấy được lịch xe!");
      return [];
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("GET VEHICLE CALENDAR ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Không lấy được lịch xe. Vui lòng thử lại!";
    toast.error(msg);

    return [];
  }
};

// =========================
// ✅ LỊCH XE THEO NHÓM
// (GET /bookings/api/Bookings/group/{groupId})
// =========================
export const getGroupBookings = async (groupId: number): Promise<Booking[]> => {
  try {
    const res = (await axiosClient.get(
      `/bookings/api/Bookings/group/${groupId}`
    )) as BaseApiResponse<Booking[]>;

    console.log("Group bookings response:", res);

    if (!res.success) {
      toast.error(res.message || "Không lấy được lịch xe theo nhóm!");
      return [];
    }

    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("GET GROUP BOOKINGS ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Không lấy được lịch xe theo nhóm. Vui lòng thử lại!";
    toast.error(msg);

    return [];
  }
};
