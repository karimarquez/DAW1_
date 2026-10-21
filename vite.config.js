import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        reportes: resolve(process.cwd(), 'reportes.html'),
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
