import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isLocal = process.env.LOCAL === 'true';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: isLocal
      ? {
          '/api': {
            target: 'http://kiii-project-backend-service:5000',
            changeOrigin: true,
            secure: false,
          },
        }
      : undefined,
    allowedHosts: ['127-0-0-1.nip.io'],
  },
});
