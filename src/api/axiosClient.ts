// axiosClient.ts
import axios, { AxiosHeaders } from "axios";
import type { AxiosError, AxiosResponse } from "axios";

// 🟢 Mở rộng AxiosRequestConfig để thêm skipAuth
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}


const axiosClient = axios.create({
  baseURL: "/api/v1", // 
  headers: {
    "Content-Type": "application/json",
  },
});



// =============================
// 🔐 Request Interceptor
// =============================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && !config.skipAuth) {
      // Dùng AxiosHeaders.from để tạo headers đúng kiểu
      const headers = AxiosHeaders.from(config.headers);

      headers.set("Authorization", `Bearer ${token}`);

      config.headers = headers;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// =============================
// 📌 Response Interceptor
// =============================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Token expired → redirect to login");
      localStorage.removeItem("token");
      // window.location.href = "/login";  // tùy bạn bật hay không
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
