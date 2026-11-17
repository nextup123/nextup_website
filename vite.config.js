import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// three.js lives in its own lazily-loaded chunk (only fetched when the 3D viewer scrolls near)
export default defineConfig({ plugins: [react()], build: { chunkSizeWarningLimit: 700 } })
