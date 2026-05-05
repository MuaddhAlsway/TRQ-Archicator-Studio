import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    copyPublicDir: true, // Copy public assets (fonts, images, etc.)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('@radix-ui')) return 'vendor-ui'
            if (id.includes('gsap')) return 'vendor-gsap'
            if (id.includes('recharts')) return 'vendor-charts'
            if (id.includes('embla-carousel')) return 'vendor-carousel'
            if (id.includes('i18next')) return 'vendor-i18n'
            return 'vendor-other'
          }
          // Component chunks
          if (id.includes('components')) {
            if (id.includes('Portfolio')) return 'page-portfolio'
            if (id.includes('Contact')) return 'page-contact'
            if (id.includes('AboutUs')) return 'page-about'
            if (id.includes('Home')) return 'page-home'
            return 'components'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
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
