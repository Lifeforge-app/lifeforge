import logger from '@/utils/logger'

import executeCommand from './commands'

export function validateMaintainerAccess(username: string): void {
  try {
    // Check permission level on the official repo
    const result = executeCommand(
      `gh api repos/lifeforge-app/lifeforge/collaborators/${username}/permission`,
      { stdio: 'pipe' }
    )

    const response = JSON.parse(result) as {
      permission: string
      user: { login: string }
    }

    // Check if permission is admin, maintain, or write
    const allowedPermissions = ['admin', 'maintain', 'write']

    if (allowedPermissions.includes(response.permission)) {
      return
    }

    logger.warn(
      'Failed to verify maintainer access. Ensure you are authenticated with "gh auth login".'
    )

    process.exit(1)
  } catch (error) {
    logger.actionableError(
      `Failed to check maintainer access for ${username}.`,
      `Error: ${error instanceof Error ? error.message : String(error)}`
    )

    process.exit(1)
  }
}

export function getGithubUser(): { name: string; email: string } | null {
  try {
    // Try getting basic user info first
    const basicInfo = executeCommand('gh api user', { stdio: 'pipe' })

    const user = JSON.parse(basicInfo) as { name: string; email: string | null }

    let email = user.email

    // If email is private/null, try fetching from /user/emails
    if (!email) {
      try {
        const emailsJson = executeCommand('gh api user/emails', {
          stdio: 'pipe'
        })

        const emails = JSON.parse(emailsJson) as Array<{
          email: string
          primary: boolean
        }>

        const primary = emails.find(e => e.primary)

        if (primary) {
          email = primary.email
        }
      } catch {
        // Ignore error if can't fetch emails, just fallback
      }
    }

    if (user.name && email) {
      return { name: user.name, email }
    }

    return null
  } catch (error) {
    logger.debug(`Failed to fetch GitHub user info: ${error}`)

    return null
  }
}
