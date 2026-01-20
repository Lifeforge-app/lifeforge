#!/usr/bin/env node
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { runCLI, setupCLI } from './cli/setup'
import { ROOT_DIR } from './constants/constants'
import logger from './utils/logger'

/**
 * LifeForge Forge - Build and development tool for LifeForge projects
 *
 * This tool provides commands for:
 * - Building, type-checking, and linting projects
 * - Starting development services (database, server, client, tools)
 * - Managing the entire LifeForge monorepo ecosystem
 */

// Load environment variables
const envPath = path.resolve(ROOT_DIR, 'env/.env.local')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, quiet: true })
} else {
  logger.warn(
    `Environment file not found at ${envPath}. Continuing without loading environment variables from file.`
  )
}

// Setup and run CLI
try {
  setupCLI()
  runCLI()
} catch (error) {
  logger.error(`Unexpected error occurred: ${error}`)
}
