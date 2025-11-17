import axiosClient from "./axiosClient";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const TOKEN_KEY = "token";
const USER_INFO_KEY = "userInfo";

// =========================
// ✅ LOGIN: POST /api/v1/auth/login
// body: { phoneNumber, password }
// =========================
export const loginUser = async (phoneNumber, password) => {
  try {
    const response = await axiosClient.post(
      "/auth/login",
      { phoneNumber, password }, // JSON body đúng theo Swagger
      {
        skipAuth: true, // login không cần Bearer token
      }
    );

    console.log("Login response.data:", response.data);

    const token = response.data?.data; // tuỳ backend trả về
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);

      // decode lấy thông tin user
      const userInfo = jwtDecode(token);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

      toast.success("Login successful!");
      return { success: true, token, user: userInfo };
    }

    toast.error("No token received.");
    return { success: false, message: "No token received." };
  } catch (error) {
    console.error("ERROR RESPONSE", error.response);
    const msg = error.response?.data?.message || "Login failed!";
    toast.error(msg);
    return { success: false, message: msg };
  }
};

// =========================
// ✅ REGISTER: POST /api/v1/auth/register
// body:
// {
//   phoneNumber,
//   password,
//   passwordConfirm,
//   email,
//   firstName,
//   lastName,
//   gender,
//   dateOfBirth,
//   address
// }
// =========================
export const registerUser = async (payload) => {
  try {
    const response = await axiosClient.post("/auth/register", payload, {
      skipAuth: true, // đăng ký chưa có token
    });

    toast.success("Register successful!");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("REGISTER ERROR", error.response);
    const msg = error.response?.data?.message || "Register failed!";
    toast.error(msg);
    return { success: false, message: msg };
  }
};

// =========================
// ✅ GET ME: GET /api/v1/auth/me
// (cần Bearer token, interceptor sẽ tự gắn)
// =========================
export const fetchMe = async () => {
  try {
    const response = await axiosClient.get("/auth/me");
    // tuỳ backend mà bạn chọn field trả ra
    return response.data;
  } catch (error) {
    console.error("FETCH ME ERROR", error.response);
    const msg = error.response?.data?.message || "Failed to get profile!";
    toast.error(msg);
    throw error;
  }
};

// =========================
// ✅ UPDATE ME: PATCH /api/v1/auth/me
// body:
// {
//   email,
//   firstName,
//   lastName,
//   gender,
//   dateOfBirth,
//   address
// }
// =========================
export const updateProfile = async (payload) => {
  try {
    const response = await axiosClient.patch("/auth/me", payload);
    toast.success("Profile updated successfully!");

    // nếu backend trả user mới thì có thể cập nhật lại localStorage
    if (response.data) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error("UPDATE PROFILE ERROR", error.response);
    const msg = error.response?.data?.message || "Failed to update profile!";
    toast.error(msg);
    throw error;
  }
};

// =========================
/* ✅ LOGOUT: POST /api/v1/auth/logout
 * query param: refreshToken
 * => backend cần cả Bearer token + refreshToken
 */
// =========================
export const logout = async (refreshToken) => {
  try {
    if (refreshToken) {
      await axiosClient.post("/auth/logout", null, {
        params: { refreshToken }, // gửi refreshToken dạng query
      });
    }
  } catch (error) {
    console.error("LOGOUT ERROR", error.response);
    // thường logout lỗi cũng chỉ log, không cần toast lỗi to quá
  } finally {
    // xoá local
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    toast.info("Logged out!");
  }
};

// =========================
// ✅ Helper: lấy user ở local
// =========================
export const getUserInfo = () => {
  const raw = localStorage.getItem(USER_INFO_KEY);
  return raw ? JSON.parse(raw) : null;
};

// ✅ Check đã login chưa
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};

// ✅ Refresh user info từ token trong localStorage
export const refreshUserInfo = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(decoded));
      return decoded;
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
      return null;
    }
  }
  return null;
};

// ✅ Lấy current token
export const getToken = () => localStorage.getItem(TOKEN_KEY);
