import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  // 排除 docs/ 目录（旧构建产物，避免污染 dev server 依赖扫描）
  // docs/ 里有历史 framer-motion chunk 引用了未安装的 @emotion/is-prop-valid
  server: {
    port: 5174,
    strictPort: true,
    fs: {
      // 允许 dev server 访问项目根目录，但忽略 docs/ 等非源码目录
      allow: ['.'],
    },
  },
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
          'framer-motion': ['framer-motion'],
          'lucide': ['lucide-react'],
          'zustand': ['zustand'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
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
    tsconfigPaths(),
    // 排除 docs/ 目录被 vite 处理（旧构建产物，含未安装依赖引用）
    {
      name: 'exclude-docs-directory',
      resolveId(id, importer) {
        // 阻止从 docs/ 目录解析任何 import
        if (importer && importer.includes('/docs/')) {
          return { id: '\0empty-module', external: true };
        }
        return null;
      },
    },
  ],
  preview: {
    port: 4173,
    strictPort: true,
  },
});
