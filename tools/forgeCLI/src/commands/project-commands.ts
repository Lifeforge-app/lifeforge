import { PROJECTS_ALLOWED, VALID_COMMANDS } from '../constants/constants'
import type { CommandType, ProjectType } from '../types'
import {
  executeCommand,
  logProcessComplete,
  logProcessStart,
  validateProjects
} from '../utils/helpers'
import CLILoggingService from '../utils/logging'

/**
 * Executes a command for multiple projects
 */
export function executeProjectCommand(
  commandType: CommandType,
  projects: ProjectType[]
): void {
  const allProjectKeys = Object.keys(PROJECTS_ALLOWED) as ProjectType[]

  const finalProjects = projects.length ? projects : allProjectKeys

  logProcessStart(commandType, finalProjects)

  for (const projectType of finalProjects) {
    const projectPath =
      PROJECTS_ALLOWED[projectType as keyof typeof PROJECTS_ALLOWED]

    const command = `cd ${projectPath} && bun run ${commandType}`

    executeCommand(command)
  }

  logProcessComplete(commandType)
}

/**
 * Validates project arguments for command execution
 */
export function validateProjectArguments(projects: string[]): void {
  const validProjects = [...Object.keys(PROJECTS_ALLOWED), 'all']

  const validation = validateProjects(projects, validProjects)

  if (!validation.isValid) {
    CLILoggingService.options(
      `Invalid project(s): ${validation.invalidProjects.join(', ')}`,
      validProjects
    )
    process.exit(1)
  }
}

/**
 * Creates command handlers for build, types, and lint commands
 */
export function createCommandHandler(commandType: CommandType) {
  return (projects: string[]) => {
    validateProjectArguments(projects)
    executeProjectCommand(commandType, projects as ProjectType[])
  }
}

/**
 * Gets available commands
 */
export function getAvailableCommands(): readonly CommandType[] {
  return VALID_COMMANDS
}
