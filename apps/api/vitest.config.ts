import { resolve } from 'path'
import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

dotenv.config({ path: resolve(__dirname, '../../env/.env.local') })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false
  },
  resolve: {
    alias: {
      '@tests': resolve(__dirname, 'src/tests'),
      '@schema': resolve(__dirname, '../database/pb_data/types.d.ts')
    }
  }
})
