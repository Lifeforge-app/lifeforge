#!/usr/bin/env node
import dotenv from 'dotenv'
import path from 'path'

import { runCLI, setupCLI } from './cli/setup'
import { CLILoggingService } from './utils/logging'

/**
 * LifeForge Forge - Build and development tool for LifeForge projects
 *
 * This tool provides commands for:
 * - Building, type-checking, and linting projects
 * - Starting development services (database, server, client, tools)
 * - Managing the entire LifeForge monorepo ecosystem
 */

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../../../env/.env.local'),
  quiet: true
})

// Setup and run CLI
try {
  setupCLI()
  runCLI()
} catch (error) {
  CLILoggingService.fatal(`Unexpected error occurred: ${error}`)
}
