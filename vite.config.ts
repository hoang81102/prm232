// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // 🔹 Auth service qua Gateway
      '/auth': {
        target: 'http://localhost:5000', // chỗ có swagger
        changeOrigin: true,
        secure: false,
      },

      // 🔹 Vehicle
      '/vehicles': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },

      // 🔹 Booking
      '/bookings': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },

      // 🔹 Groups / Contracts / Votes / Disputes
      '/groups': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },

      // 🔹 Finance
      '/finance': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
