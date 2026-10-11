#!/usr/bin/env node
import { log } from '@clack/prompts'
import { program } from 'commander'
/**
 * Static command registry for bundled CLI.
 * All commands must be explicitly imported here since dynamic imports
 * don't work in bundled code.
 */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import COMMANDS from './commands'
import { ROOT_DIR } from './utils/constants'

function getVersion(): string {
  try {
    const packagePath = path.resolve(__dirname, '../../package.json')

    return JSON.parse(fs.readFileSync(packagePath, 'utf-8')).version
  } catch {
    return '0.0.0'
  }
}

// Load environment variables
const envPath = path.resolve(ROOT_DIR, 'env/.env.local')

const dockerEnvPath = path.resolve(ROOT_DIR, 'env/.env.docker')

const paths = [envPath, dockerEnvPath].filter(fs.existsSync)

dotenv.config({ path: paths, quiet: true })

// Setup and run CLI
try {
  program
    .name('pnpm forge')
    .description('Build and manage the LifeForge ecosystem')
    .version(getVersion())
    .enablePositionalOptions()
    .option('--host', 'Expose frontend client on the local network')
    .option(
      '--port <port>',
      'Specify the port for the client dev server (default: 5173)'
    )

  for (const registerCommand of COMMANDS) {
    registerCommand(program)
  }

  program.parse()
} catch (error) {
  log.error(`Unexpected error occurred: ${error}`)
}
