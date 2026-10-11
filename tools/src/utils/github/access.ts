import { log } from '@clack/prompts'

import executeCommand from '@/utils/commands'

/** Validates that `username` has maintainer access to the official repo. */
export function validateMaintainerAccess(username: string): void {
  try {
    // Check permission level on the official repo
    const result = executeCommand(
      `gh api repos/lifeforge-app/lifeforge/collaborators/${username}/permission`
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

    log.warn(
      'Failed to verify maintainer access. Ensure you are authenticated with "gh auth login".'
    )

    process.exit(1)
  } catch {
    log.error(`Failed to check maintainer access for ${username}.`)

    process.exit(1)
  }
}
