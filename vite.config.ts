import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp4'], // Include MP4 files as assets
  server: {
    port: 5173,
    host: true,
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep video files with their original names for easier reference
          if (assetInfo.name?.endsWith('.mp4')) {
            return 'assets/videos/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})