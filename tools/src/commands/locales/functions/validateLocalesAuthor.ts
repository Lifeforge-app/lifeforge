import fs from 'fs'
import path from 'path'

import { validateMaintainerAccess } from '@/utils/github-cli'
import logger from '@/utils/logger'
import { checkAuth } from '@/utils/registry'

export default async function validateLocalesAuthor(modulePath: string) {
  const auth = await checkAuth()

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(modulePath, 'package.json'), 'utf-8')
  )

  const nameWithoutScope = packageJson.name.replace('@lifeforge/', '')

  const usernamePrefix = nameWithoutScope.split('--')[0]

  if (usernamePrefix && usernamePrefix !== auth.username) {
    if (usernamePrefix === 'lifeforge') {
      validateMaintainerAccess(auth.username || '')
    } else {
      logger.actionableError(
        `Cannot publish as "${auth.username}" - package belongs to "${usernamePrefix}"`,
        `You can only publish packages starting with @lifeforge/${auth.username}--`
      )
      process.exit(1)
    }
  }
}
