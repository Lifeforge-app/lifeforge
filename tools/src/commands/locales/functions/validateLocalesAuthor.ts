import fs from 'fs'
import path from 'path'

import { validateMaintainerAccess } from '@/utils/github-cli'
import { getGithubLogin } from '@/utils/github'
import logger from '@/utils/logger'

export default async function validateLocalesAuthor(modulePath: string) {
  const username = getGithubLogin()

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(modulePath, 'package.json'), 'utf-8')
  )

  const nameWithoutScope = packageJson.name.replace('@lifeforge/', '')

  const usernamePrefix = nameWithoutScope.split('--')[0]

  if (usernamePrefix && usernamePrefix !== username) {
    if (usernamePrefix === 'lifeforge') {
      validateMaintainerAccess(username)
    } else {
      logger.error(
        `Cannot publish as "${username}" - package belongs to "${usernamePrefix}". You can only publish packages starting with @lifeforge/${username}--`
      )
      process.exit(1)
    }
  }
}
