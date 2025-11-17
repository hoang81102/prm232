// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'   // hoặc '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,                // đúng port bạn đang chạy
    proxy: {
      '/api': {
        target: 'https://localhost:7441', // BE thật
        changeOrigin: true,
        secure: false,                    // vì HTTPS local, cert tự ký
      },
    },
  },
})
