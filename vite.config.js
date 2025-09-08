import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
        port: 3000,
    proxy: {
      '/connect': {
        target: 'https://edeaf-api-staging.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})