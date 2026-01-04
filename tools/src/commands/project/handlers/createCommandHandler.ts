import type { CommandType } from '../constants/commands'
import type { ProjectType } from '../constants/projects'
import { executeProjectCommand } from '../functions/executeProjectCommand'
import { validateProjectArguments } from '../functions/validateProjectArguments'

/**
 * Creates command handlers for build, types, and lint commands
 */
export function createCommandHandler(commandType: CommandType) {
  return (projects: ProjectType[] | undefined) => {
    validateProjectArguments(projects)
    executeProjectCommand(commandType, projects)
  }
}
