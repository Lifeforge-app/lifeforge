import fs from 'fs'

import executeCommand from '@/utils/commands'
import Logging, { LEVEL_ORDER } from '@/utils/logging'
import { addDependency } from '@/utils/packageJson'

function installAndMoveLocales(fullPackageName: string, targetDir: string) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  Logging.debug(
    `Installing ${Logging.highlight(fullPackageName)} from registry...`
  )

  executeCommand(`bun add ${fullPackageName}@latest`, {
    cwd: process.cwd(),
    stdio: Logging.level > LEVEL_ORDER['info'] ? 'pipe' : 'inherit'
  })

  const installedPath = `${process.cwd()}/node_modules/${fullPackageName}`

  if (!fs.existsSync(installedPath)) {
    throw new Error(`Failed to install ${fullPackageName}`)
  }

  Logging.debug(
    `Copying ${Logging.highlight(fullPackageName)} to ${targetDir}...`
  )

  fs.cpSync(installedPath, targetDir, { recursive: true })

  addDependency(fullPackageName)

  fs.rmSync(installedPath, { recursive: true, force: true })
  
}

export default installAndMoveLocales
