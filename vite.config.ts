import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve la app en https://dbtech-cali.github.io/cv/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/cv/' : '/',
}));
