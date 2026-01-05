import executeCommand from '@/utils/commands'

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

  for (const projectType of finalProjects) {
    const projectPath = PROJECTS[projectType as ProjectType]

    executeCommand(`bun run ${commandType}`, {
      cwd: projectPath,
      stdio: 'pipe'
    })
  }
}
