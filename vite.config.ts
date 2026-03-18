import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'


// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [TanStackRouterVite({ routesDirectory: './src/app/routes', generatedRouteTree: './src/app/router/routeTree.gen.ts' }), react(), tailwindcss(),],
})
