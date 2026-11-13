import dotenv from 'dotenv'

import { ENV_PATH } from './constants'

let loaded = false

/** Loads `env/.env.local` once. Safe to call multiple times. */
export function loadEnv(): void {
  if (loaded) {
    return
  }

  dotenv.config({ path: ENV_PATH, quiet: true })
  loaded = true
}

/** Returns a required env var, throwing a clear error when missing. */
export function requireEnv(name: string): string {
  loadEnv()

  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not set (expected in ${ENV_PATH})`)
  }

  return value
}
