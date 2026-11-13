import { log } from '@clack/prompts'
import chalk from 'chalk'

import executeCommand from '@/utils/commands'
import { getRepoSlug } from '@/utils/github'
import { assertKebabRepo } from '@/utils/kebab'

/**
 * Validates that a module can actually be pushed to and registered from its
 * GitHub repository.
 *
 * Checks that package.json declares a repository, that the repo name is
 * dash-case, that the repository is reachable through the GitHub CLI, and that
 * the current branch has an upstream to push to. Exits the process if any check
 * fails - all of them must pass before a release is committed or tagged.
 *
 * @param modulePath - The path to the module directory.
 * @returns The `owner/repo` slug of the module's GitHub repository.
 */
export default function validateModuleRepo(modulePath: string): string {
  let repo: string

  try {
    repo = getRepoSlug(modulePath)
  } catch {
    log.error(
      'Missing "repository" URL in package.json. Publishing needs the GitHub repo.'
    )
    process.exit(1)
  }

  assertKebabRepo(repo)

  try {
    executeCommand(`gh api repos/${repo} --jq .full_name`)
  } catch {
    log.error(
      `Cannot access ${chalk.blue(repo)}. Check the "repository" URL in package.json and your GitHub access.`
    )
    process.exit(1)
  }

  try {
    executeCommand('git rev-parse --abbrev-ref --symbolic-full-name "@{u}"', {
      cwd: modulePath
    })
  } catch {
    log.error(
      'The current branch has no upstream. Push it once with "git push -u origin <branch>" before publishing.'
    )
    process.exit(1)
  }

  return repo
}
