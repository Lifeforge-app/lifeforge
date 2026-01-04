import {
  executeCommand,
  logProcessComplete,
  logProcessStart
} from '@/utils/helpers'

import type { CommandType } from '../constants/commands'
import { PROJECTS, type ProjectType } from '../constants/projects'

/**
 * Executes a command for multiple projects
 */
export function executeProjectCommand(
  commandType: CommandType,
  projects: ProjectType[] | undefined
): void {
  const allProjectKeys = Object.keys(PROJECTS)

  const finalProjects = projects?.length ? projects : allProjectKeys

  logProcessStart(commandType, finalProjects)

  for (const projectType of finalProjects) {
    const projectPath = PROJECTS[projectType as ProjectType]

    const command = `cd ${projectPath} && bun run ${commandType}`

    executeCommand(command)
  }

  logProcessComplete(commandType)
}
