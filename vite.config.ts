import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/Zogna-AI/' : '/',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 9002,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3400',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
