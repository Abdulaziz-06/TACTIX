import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'three/build/three.module.js': 'three',
      '@luma.gl/core': path.resolve(__dirname, 'node_modules/@luma.gl/core'),
      '@deck.gl/core': path.resolve(__dirname, 'node_modules/@deck.gl/core'),
    },
  },
  optimizeDeps: {
    include: ['date-fns', 'three', 'three-globe', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/react'],
    exclude: ['@deck.gl/widgets'], // Externalize to avoid bundling issues if missing
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      }
    }
  },
  build: {
    target: 'esnext'
  },
  server: {
    fs: {
      strict: false
    }
  }
})
