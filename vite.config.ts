import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Разрешаем обслуживание файлов из корня проекта
      strict: false,
    },
    hmr: {
      protocol: 'ws',
    },
    middlewareMode: false,
  },
  optimizeDeps: {
    // Исключаем documents.json из предварительной оптимизации
    exclude: ['../data/documents.json'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Правильные расширения для модулей
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    // Убеждаемся, что модули правильно обрабатываются
    target: 'esnext',
    modulePreload: {
      polyfill: true,
    },
  },
})

