import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8080',
      '/swagger-ui.html': 'http://localhost:8080',
      '/swagger-ui': 'http://localhost:8080',
      '/api-docs': 'http://localhost:8080',
    },
  },
})
