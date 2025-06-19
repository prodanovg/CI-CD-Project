import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//standard and can be used with nginx
// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
// })
//


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,   // Required for hot reload to work inside Docker
    },
    proxy: {
      '/api': {
        target: 'http://backend:5000', // Flask container name and port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
