import axiosClient from "./axiosClient";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_INFO_KEY = "userInfo";

// =========================
// Kiểu dữ liệu
// =========================
export interface ApiResponse<T> {
  data: T;
  message?: string;
  [key: string]: any;
}

// BE trả về:
// {
//   "accessToken": "...",
//   "refreshToken": "...",
//   "role": "co-owner"
// }
type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  role: string; // co-owner, admin, staff ...
};

type RegisterPayload = {
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
};

type UpdateProfilePayload = {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
};

type Role = "Admin" | "Staff" | "CoOwner";

export interface UserInfo {
  role: Role;
  [key: string]: any;
}

// payload thật trong token (role là string tự do)
type DecodedToken = {
  role?: string;
  [key: string]: any;
};

const mapBackendRoleToFrontend = (role?: string): Role => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "Admin";
    case "staff":
      return "Staff";
    case "co-owner":
    case "coowner":
      return "CoOwner";
    default:
      // fallback, tuỳ bạn muốn default là gì
      return "CoOwner";
  }
};

// =========================
// ✅ LOGIN
// =========================
export const loginUser = async (
  phoneNumber: string,
  password: string
): Promise<
  | { success: true; token: string; user: UserInfo }
  | { success: false; message: string }
> => {
  try {
    // axiosClient đã trả luôn response.data,
    // ở đây chính là object { accessToken, refreshToken, role }
    const res = (await axiosClient.post(
      "/auth/login",
      { phoneNumber, password },
      { skipAuth: true }
    )) as LoginResponse;

    console.log("Login response from server:", res);

    const token = res.accessToken;

    if (!token) {
      toast.error("No token received.");
      return { success: false, message: "No token received." };
    }

    // Lưu token + refresh token
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);

    // Giải mã token
    const decoded = jwtDecode<DecodedToken>(token);
    const normalizedRole = mapBackendRoleToFrontend(decoded.role ?? res.role);

    const userInfo: UserInfo = {
      ...decoded,
      role: normalizedRole,
    };

    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    toast.success("Login successful!");
    return { success: true, token, user: userInfo };
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("ERROR RESPONSE", error.response);
    const msg =
      (error.response?.data as any)?.message ||
      "Không kết nối được tới server. Vui lòng thử lại!";
    toast.error(msg);
    return { success: false, message: msg };
  }
};

// =========================
// ✅ REGISTER
// =========================
export const registerUser = async (
  payload: RegisterPayload
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const rawResponse = await axiosClient.post("/auth/register", payload, {
      skipAuth: true,
    });

    const response = rawResponse as ApiResponse<any>;

    toast.success("Register successful!");
    return { success: true, data: response.data };
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("REGISTER ERROR", error.response);
    const msg = (error.response?.data as any)?.message || "Register failed!";
    toast.error(msg);
    return { success: false, message: msg };
  }
};

// =========================
// ✅ GET ME
// =========================
export const fetchMe = async (): Promise<any> => {
  try {
    const rawResponse = await axiosClient.get("/auth/me");
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

// =========================
/** ✅ UPDATE ME */
// =========================
export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<any> => {
  try {
    const rawResponse = await axiosClient.patch("/auth/me", payload);
    const response = rawResponse as ApiResponse<any>;

    toast.success("Profile updated successfully!");

    if (response.data) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("UPDATE PROFILE ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to update profile!";
    toast.error(msg);
    throw err;
  }
};

// =========================
// ✅ LOGOUT
// =========================
export const logout = async (refreshToken?: string): Promise<void> => {
  try {
    if (refreshToken) {
      await axiosClient.post("/auth/logout", null, {
        params: { refreshToken },
      });
    }
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("LOGOUT ERROR", error.response);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    toast.info("Logged out!");
  }
};

// =========================
// ✅ Helpers
// =========================
export const getUserInfo = (): UserInfo | null => {
  const raw = localStorage.getItem(USER_INFO_KEY);
  return raw ? (JSON.parse(raw) as UserInfo) : null;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};

export const refreshUserInfo = (): UserInfo | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const normalizedRole = mapBackendRoleToFrontend(decoded.role);
      const userInfo: UserInfo = { ...decoded, role: normalizedRole };
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      console.error("Invalid token:", error);
      void logout();
      return null;
    }
  }
  return null;
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
