import logger from '@/utils/logger'

import { PROJECTS } from '../constants/projects'

function validateProjects(
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

export function validateProjectArguments(projects: string[] | undefined): void {
  const validProjects = Object.keys(PROJECTS)

  if (!projects?.length || !projects) {
    return
  }

  const validation = validateProjects(projects, validProjects)

  if (!validation.isValid) {
    logger.error(
      `Invalid project(s): ${validation.invalidProjects.join(', ')}. Available projects: ${validProjects.join(', ')}`
    )
    process.exit(1)
  }
}
