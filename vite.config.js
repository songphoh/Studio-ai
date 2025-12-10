import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/n8n': {
        target: 'https://n8n.servergot.xyz/webhook',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, ''),
      },
      '/api/n8n-test': {
        target: 'https://n8n.servergot.xyz/webhook-test',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/n8n-test/, ''),
      },
    },
  },
})
