import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use '/' on Vercel, but keep '/career_pages/' for GitHub Pages
  base: process.env.VERCEL ? '/' : '/career_pages/',
})
