import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    copyPublicDir: false, // Disable Vite's copy, use our script instead
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-i18next', 'i18next'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-presence'],
          'animations': ['gsap', 'react-scroll-parallax'],
          'charts': ['recharts'],
          'carousel': ['embla-carousel-react'],
        }
      }
    },
    chunkSizeWarningLimit: 500
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4242',
        changeOrigin: true,
      }
    }
  }
})
