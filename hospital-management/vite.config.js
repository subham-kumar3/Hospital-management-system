import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const proxyConfig = (target) => ({
  '/api': {
    target,
    changeOrigin: true
  },
  '/socket.io': {
    target,
    changeOrigin: true,
    ws: true
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devApiTarget = env.VITE_DEV_API_URL

  if (!devApiTarget && mode === 'development') {
    console.warn(
      '⚠️  VITE_DEV_API_URL not set in .env.development — add: VITE_DEV_API_URL=http://localhost:5001'
    )
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      open: true,
      proxy: devApiTarget ? proxyConfig(devApiTarget) : undefined
    },
    preview: {
      port: 4173,
      host: true,
      proxy: devApiTarget ? proxyConfig(devApiTarget) : undefined
    }
  }
})
