import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide': ['lucide-react'],
          'zustand': ['zustand'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
  },
  plugins: [
    react({}),
    tsconfigPaths()
  ],
})
