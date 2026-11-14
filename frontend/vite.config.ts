import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Modos de build das Telas 1 (ORD-07) e 2 (ORD-11):
 * - `demo` (padrão): só o mock; as flags ficam `false` e o código do backend real sai do pacote.
 * - `integrado`: liga o backend real; usar só depois que o ORD-05/06 (Tela 1) e o ORD-09 (Tela 2)
 *   estiverem no ar.
 * O valor é fixado só no `vite build`; em desenvolvimento e nos testes vale o `.env` de sempre.
 */
export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  define:
    command === 'build'
      ? {
          'import.meta.env.VITE_BACKEND_CONSUMIDOR': JSON.stringify(mode === 'integrado' ? 'true' : 'false'),
          'import.meta.env.VITE_BACKEND_LOJISTA': JSON.stringify(mode === 'integrado' ? 'true' : 'false'),
        }
      : {},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}))
