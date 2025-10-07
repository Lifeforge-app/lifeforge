import { execSync } from 'child_process'

import type { CommandExecutionOptions } from '../types'

/**
 * Validates if the provided projects are valid
 */
export function validateProjects(
  projects: string[],
  validProjects: string[]
): { isValid: boolean; invalidProjects: string[] } {
  const invalidProjects = projects.filter(
    project => !validProjects.includes(project)
  )

  return {
    isValid: invalidProjects.length === 0,
    invalidProjects
  }
}

/**
 * Resolves project list, handling 'all' keyword
 */
export function resolveProjects<T extends string>(
  projects: string[],
  allProjects: T[]
): T[] {
  const isAll = projects.includes('all')
  return isAll ? allProjects : (projects as T[])
}

/**
 * Executes a shell command with proper error handling
 */
export function executeCommand(
  command: string,
  options: CommandExecutionOptions = {}
): void {
  try {
    console.log(`📋 Executing: ${command}`)
    execSync(command, {
      stdio: 'inherit',
      ...options
    })
    console.log(`✅ Completed: ${command}`)
  } catch (error) {
    console.error(`❌ Failed: ${command}`)
    console.error(error)
    process.exit(1)
  }
}

/**
 * Validates environment variables
 */
export function validateEnvironment(requiredVars: string[]): void {
  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(
      `❌ Error: Missing required environment variables: ${missingVars.join(', ')}`
    )
    console.error('Please set them in your .env file.')
    process.exit(1)
  }
}

/**
 * Formats project list for display
 */
export function formatProjectList(projects: string[]): string {
  return projects.join(', ')
}

/**
 * Logs a process start message
 */
export function logProcessStart(processType: string, projects: string[]): void {
  console.log(
    `🚀 Running ${processType} for ${projects.length} project(s): ${formatProjectList(projects)}`
  )
}

/**
 * Logs a process completion message
 */
export function logProcessComplete(processType: string): void {
  console.log(`🎉 All projects ${processType} completed successfully.`)
}
