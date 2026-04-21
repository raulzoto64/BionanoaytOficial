import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    emptyOutDir: false
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-bionano-api',
      closeBundle: async () => {
        // Copiar automaticamente la carpeta bionano-api dentro de dist despues de cada build
        fs.cpSync('./bionano-api', './dist/bionano-api', { recursive: true })
        console.log('\x1b[32m✅ Carpeta bionano-api copiada exitosamente en dist/\x1b[0m')
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
