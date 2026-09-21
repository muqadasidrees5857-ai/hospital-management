import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://hospital-management-5ocs.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
