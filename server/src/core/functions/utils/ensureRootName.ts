import path from 'path'

import { LoggingService } from '@functions/logging/loggingService'

/**
 * Ensures the root directory name is 'lifeforge'.
 * Exits the process if the root directory name is not 'lifeforge'.
 */
export default function ensureRootName(): void {
  const projectRoot = path.basename(
    path.resolve(import.meta.dirname.split('server')[0])
  )

  if (projectRoot !== 'lifeforge') {
    LoggingService.error(
      `Project root directory must be named 'lifeforge', but found '${projectRoot}'. Please rename the root directory.`
    )
    process.exit(1)
  }
}
