import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/weather-dashboard/ via GitHub Pages.
  base: '/weather-dashboard/',
  plugins: [react()],
})
