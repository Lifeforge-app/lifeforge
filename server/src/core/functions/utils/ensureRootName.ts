import path from 'path'

import { coreLogger } from '@functions/logging'

/**
 * Logs a warning if the root directory name is not 'lifeforge'.
 * This is for informational purposes only and does not prevent execution.
 */
export default function ensureRootName(): void {
  const projectRoot = path.basename(
    path.resolve(import.meta.dirname.split('server')[0])
  )

  if (projectRoot !== 'lifeforge') {
    coreLogger.warn(
      `Project root directory is '${projectRoot}', not 'lifeforge'. Some features may not work as expected.`
    )
  }
}
