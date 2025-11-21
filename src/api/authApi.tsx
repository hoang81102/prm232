import axiosClient from "./axiosClient";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { Account } from "../types/account";
import type { ApiResponseDetail } from "./vehicleApi";
import type { AccountFormValues } from "../components/account/AccountForm";

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

// ====== LOGIN RESPONSE THỰC TẾ TỪ BE ======
type LoginData = {
  accessToken: string;
  refreshToken?: string | null;
  role: string; // co-owner, admin, staff ...
  [key: string]: any; // userId, phoneNumber,...
};

type LoginResponse = {
  success: boolean;
  errorCode?: string | null;
  message?: string;
  data: LoginData;
};

// =========================================

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
    // Gọi đúng Gateway Endpoint: /auth/api/Auth/login
    const res = (await axiosClient.post(
      "/auth/api/Auth/login",
      { phoneNumber, password },
      { skipAuth: true }
    )) as LoginResponse;

    console.log("Login response from server:", res);

    // accessToken nằm trong res.data
    const loginData = res.data ?? (res as any);
    const token = loginData.accessToken;

    if (!token) {
      toast.error("No token received.");
      return { success: false, message: "No token received." };
    }

    // Lưu token + refresh token (nếu có)
    localStorage.setItem(TOKEN_KEY, token);
    if (loginData.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, loginData.refreshToken);
    }

    // Giải mã token
    const decoded = jwtDecode<DecodedToken>(token);
    const normalizedRole = mapBackendRoleToFrontend(
      decoded.role ?? loginData.role
    );

    const userInfo: UserInfo = {
      ...decoded,
      role: normalizedRole,
    };

    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    toast.success(res.message || "Login successful!");
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
type RegisterResponse = {
  message?: string;
  data?: any;
  [key: string]: any;
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    // Gọi đúng Gateway Endpoint: /auth/api/Auth/register
    const res = (await axiosClient.post("/auth/api/Auth/register", payload, {
      skipAuth: true,
    })) as RegisterResponse;

    console.log("Register response from server:", res);

    const data = res.data ?? res;
    const msg = res.message ?? "Register successful!";

    toast.success(msg);
    return { success: true, data, message: msg };
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
// (giả định Gateway có endpoint /auth/api/Auth/me)
// =========================
export const fetchMe = async (): Promise<any> => {
  try {
    const res = await axiosClient.get("/auth/api/Auth/me");
    console.log("ME RESPONSE", res);
    return res;
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
// ✅ UPDATE ME
// =========================
export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<any> => {
  try {
    const rawResponse = await axiosClient.patch("/auth/api/Auth/me", payload);
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
// (giả định Gateway có endpoint /auth/api/Auth/logout)
// =========================
export const logout = async (refreshToken?: string): Promise<void> => {
  try {
    if (refreshToken) {
      await axiosClient.post("/auth/api/Auth/logout", null, {
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

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const rawResponse = await axiosClient.get(`/auth/api/admin/users`);
    const response = rawResponse as ApiResponseDetail<Account[]>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH ACCOUNTS ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get accounts!";
    toast.error(msg);
    throw err;
  }
};

export const getAccount = async (accountId: number): Promise<Account> => {
  try {
    const rawResponse = await axiosClient.get(
      `/auth/api/admin/users/${accountId}`
    );
    const response = rawResponse as ApiResponseDetail<Account>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("FETCH ACCOUNTS ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to get accounts!";
    toast.error(msg);
    throw err;
  }
};

export const createAccount = async (accountReggister: AccountFormValues): Promise<Account> => {
  try {
    const rawResponse = await axiosClient.post(`/auth/api/admin/users`, accountReggister);
    const response = rawResponse as ApiResponseDetail<Account>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("ADD ACCOUNTS ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to add accounts!";
    toast.error(msg);
    throw err;
  }
};

export const updateAccount = async (userId: number, accountUpdate: Account): Promise<Account> => {
  try {
    const rawResponse = await axiosClient.put(`/auth/api/admin/users/${userId}`, accountUpdate);
    const response = rawResponse as ApiResponseDetail<Account>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("UPDATE ACCOUNTS ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to update accounts!";
    toast.error(msg);
    throw err;
  }
};

export const deleteAccount = async (userId: number): Promise<Account> => {
  try {
    const rawResponse = await axiosClient.delete(`/auth/api/admin/users/${userId}`);
    const response = rawResponse as ApiResponseDetail<Account>;
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("DELETE ACCOUNTS ERROR", error.response);
    const msg =
      (error.response?.data as any)?.message || "Failed to delete accounts!";
    toast.error(msg);
    throw err;
  }
};
