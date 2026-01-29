import fs from 'fs'
import path from 'path'
import z from 'zod'

import { validateMaintainerAccess } from '@/utils/github-cli'
import logger from '@/utils/logger'
import { checkAuth } from '@/utils/registry'

export default async function validateModuleAuthor(modulePath: string) {
  const auth = await checkAuth()

  const { packageJSONSchema } = await import('shared')

  const packageJson = z.safeParse(
    packageJSONSchema,
    JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf-8'))
  )

  if (!packageJson.success) {
    logger.error(
      'Invalid package.json. Please refer to the documentation for the correct format.'
    )
    process.exit(1)
  }

  const nameWithoutScope = packageJson.data.name.replace('@lifeforge/', '')

  const usernamePrefix = nameWithoutScope.split('--')[0]

  if (usernamePrefix && usernamePrefix !== auth.username) {
    if (usernamePrefix === 'lifeforge') {
      validateMaintainerAccess(auth.username || '')
    } else {
      logger.error(
        `Cannot publish as "${auth.username}" - package belongs to "${usernamePrefix}". You can only publish packages starting with @lifeforge/${auth.username}--`
      )
      process.exit(1)
    }
  }
}
