import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      '@schema': resolve(__dirname, '../database/pb_data/types.d.ts')
    }
  }
})
