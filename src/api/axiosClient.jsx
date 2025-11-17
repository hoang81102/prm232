import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:7441/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Nếu có token và không yêu cầu bỏ qua auth
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor (tùy chọn)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Nếu token hết hạn → logout hoặc chuyển trang login
    if (error.response?.status === 401) {
      console.warn("Token expired → redirect to login");
      localStorage.removeItem("token");
      // window.location.href = "/login"; // bật nếu muốn auto chuyển trang
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
