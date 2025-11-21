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
interface ApiResponse<T> {
  data: T;
  message?: string;
  [key: string]: any;
}

// ====== LOGIN RESPONSE THỰC TẾ TỪ BE ======
type LoginData = {
  accessToken: string;
  refreshToken?: string | null;
  role: string; // co-owner, admin, staff ...
  [key: string]: any; // userId, phoneNumber, coOwnerGroupId,...
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

    // ⭐ TÁCH accessToken / refreshToken RA, LẤY PHẦN CÒN LẠI (userId, coOwnerGroupId, email,...)
    const {
      accessToken,
      refreshToken,
      role: backendRole,
      ...restLoginData
    } = loginData as LoginData;

    // ⭐ GỘP restLoginData (từ BE) + decoded (payload token)
    const userInfo: UserInfo = {
      ...restLoginData, // chứa userId, coOwnerGroupId,... nếu BE trả
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
// ✅ REGISTER (đã viết lại theo đúng API thật)
// =========================
type RegisterResponse = {
  success: boolean;
  errorCode?: string | null;
  message?: string;
  data?: any;
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    // ⚠️ Map payload FE → đúng body BE yêu cầu
    const requestBody = {
      phoneNumber: payload.phoneNumber,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      validCitizenIdentification: true, // theo swagger BE yêu cầu
    };

    const res = (await axiosClient.post(
      "/auth/api/Auth/register",
      requestBody,
      { skipAuth: true }
    )) as RegisterResponse;

    console.log("Register response from server:", res);

    if (!res.success) {
      const msg = res.message || "Register failed!";
      toast.error(msg);
      return { success: false, message: msg };
    }

    toast.success(res.message || "Register success!");
    return {
      success: true,
      message: res.message,
      data: res.data,
    };
  } catch (err) {
    const error = err as AxiosError<any>;
    console.error("REGISTER ERROR", error.response);

    const msg =
      (error.response?.data as any)?.message ||
      "Register failed!";
    toast.error(msg);

    return { success: false, message: msg };
  }
};
// =========================
// ✅ GET ME (UserProfiles GET /auth/api/profiles/me)
// =========================
export const fetchMe = async (): Promise<UserInfo> => {
  try {
    const res = (await axiosClient.get(
      "/auth/api/profiles/me"
    )) as ApiResponse<any>;

    console.log("ME RESPONSE", res);

    // backend trả { success, errorCode, message, data: {...} }
    const rawProfile = res.data ?? (res as any).data ?? (res as any);

    const normalizedRole = mapBackendRoleToFrontend(rawProfile.role);
    const userInfo: UserInfo = {
      ...rawProfile,
      role: normalizedRole,
    };

    // lưu lại userInfo mới nhất
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    return userInfo;
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
// ✅ UPDATE ME (UserProfiles PUT /auth/api/profiles/me)
// =========================
export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<UserInfo> => {
  try {
    const rawResponse = await axiosClient.put("/auth/api/profiles/me", payload);
    const response = rawResponse as ApiResponse<any>;

    const rawProfile =
      response.data ?? (response as any).data ?? (response as any);

    const normalizedRole = mapBackendRoleToFrontend(rawProfile.role);
    const userInfo: UserInfo = {
      ...rawProfile,
      role: normalizedRole,
    };

    toast.success(response.message || "Profile updated successfully!");

    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    return userInfo;
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

      // ⭐ giữ lại info cũ (userId,...), chỉ cập nhật lại claim từ token
      const rawExisting = localStorage.getItem(USER_INFO_KEY);
      const existing = rawExisting ? (JSON.parse(rawExisting) as any) : {};

      const userInfo: UserInfo = {
        ...existing,
        ...decoded,
        role: normalizedRole,
      };
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
