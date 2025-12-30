#!/usr/bin/env node
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { runCLI, setupCLI } from './cli/setup'
import CLILoggingService from './utils/logging'

/**
 * LifeForge Forge - Build and development tool for LifeForge projects
 *
 * This tool provides commands for:
 * - Building, type-checking, and linting projects
 * - Starting development services (database, server, client, tools)
 * - Managing the entire LifeForge monorepo ecosystem
 */

// Load environment variables
const envPath = path.resolve(process.cwd(), 'env/.env.local')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, quiet: true })
} else {
  CLILoggingService.warn(
    `Environment file not found at ${envPath}. Continuing without loading environment variables from file. Consider creating the file manually or using the command "forge db init".`
  )
}

// Setup and run CLI
try {
  await setupCLI()
  runCLI()
} catch (error) {
  CLILoggingService.fatal(`Unexpected error occurred: ${error}`)
}
