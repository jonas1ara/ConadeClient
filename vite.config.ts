import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
	outDir: 'build',		
  },
  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier dispositivo en la red local
    port: 5173,      // Puerto de tu servidor
  },
});
