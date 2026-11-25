import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    target: 'es2019',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
