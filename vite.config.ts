// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // hoặc '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // đúng port bạn đang chạy
    proxy: {
      "/auth": {
        target: "http://localhost:5000", // BE thật
        changeOrigin: true,
        secure: false, // vì HTTPS local, cert tự ký
      },
      "/vehicles": {
        target: "http://localhost:5000", // BE thật
        changeOrigin: true,
        secure: false, // vì HTTPS local, cert tự ký
      },
      "/bookings": {
        target: "http://localhost:5000", // BE thật
        changeOrigin: true,
        secure: false, // vì HTTPS local, cert tự ký
      },
      "/finance": {
        target: "http://localhost:5000", // BE thật
        changeOrigin: true,
        secure: false, // vì HTTPS local, cert tự ký
      },
      "/groups": {
        target: "http://localhost:5000", // BE thật
        changeOrigin: true,
        secure: false, // vì HTTPS local, cert tự ký
      },
    },
  },
});
