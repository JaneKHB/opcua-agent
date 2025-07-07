import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // ← Electron에서는 상대경로로 로드해야 함
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../../dist/frontend', // Electron이 빌드 결과를 쉽게 찾도록
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});