#!/usr/bin/env node
import dotenv from 'dotenv'
import path from 'path'

import { runCLI, setupCLI } from './cli/setup'

/**
 * Lifeforge Forge - Build and development tool for Lifeforge projects
 *
 * This tool provides commands for:
 * - Building, type-checking, and linting projects
 * - Starting development services (database, server, client, tools)
 * - Managing the entire Lifeforge monorepo ecosystem
 */

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../../env/.env.local')
})

// Setup and run CLI
try {
  setupCLI()
  runCLI()
} catch (error) {
  console.error('❌ Fatal error:', error)
  process.exit(1)
}
