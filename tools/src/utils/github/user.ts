import { log } from '@clack/prompts'

import executeCommand from '@/utils/commands'

import { run } from './cli'

/** Returns the authenticated GitHub user's login. */
export function getGithubLogin(): string {
  return run('gh api user --jq .login')
}

/** Returns the authenticated GitHub user's name and email, if available. */
export function getGithubUser(): { name: string; email: string } | null {
  try {
    // Try getting basic user info first
    const basicInfo = executeCommand('gh api user')

    const user = JSON.parse(basicInfo) as { name: string; email: string | null }

    let email = user.email

    // If email is private/null, try fetching from /user/emails
    if (!email) {
      try {
        const emailsJson = executeCommand('gh api user/emails')

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
  } catch {
    log.error(`Failed to fetch GitHub user info.`)

    return null
  }
}
