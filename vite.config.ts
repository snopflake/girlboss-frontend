import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Harus sama dengan CORS_ORIGIN di backend. strictPort membuat Vite gagal
    // dengan jelas bila port terpakai, alih-alih pindah ke 5174 dan memicu
    // error CORS ("Tidak dapat terhubung ke layanan autentikasi").
    port: 5173,
    strictPort: true,
  },
})
