import dotenv from 'dotenv'
import fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

function findEnvFile(startDir: string): string | null {
  let dir = startDir
  while (true) {
    const envPath = resolve(dir, 'env', '.env.local')
    if (fs.existsSync(envPath)) return envPath
    const parent = resolve(dir, '..')
    if (parent === dir) break
    dir = parent
  }
  return null
}

const envPath = findEnvFile(__dirname || process.cwd())

if (envPath) {
  dotenv.config({ path: envPath })
}

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
