import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { // This is the prefix for API requests in your frontend
          target: env.VITE_FRONTEND_URL,
          changeOrigin: true
        },
      },
    },
  }
})