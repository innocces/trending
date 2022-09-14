import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    https: true
  },
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      '@': '/src',
      '@layout': '/src/layout',
      '@page': '/src/pages',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@const': '/src/constant',
      '@service': '/src/services',
      'node-fetch': 'isomorphic-fetch'
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          trending: '__trending'
        }
      }
    }
  }
})
