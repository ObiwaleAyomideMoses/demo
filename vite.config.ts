import { defineConfig } from 'vite'
import vercel from 'vite-plugin-vercel'
import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ssr()],
})
