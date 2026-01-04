import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import { addWorkspaceDependency } from '@/utils/package'

function installAndMoveLocales(fullPackageName: string, targetDir: string) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  executeCommand(`bun add ${fullPackageName}@latest`, {
    cwd: process.cwd(),
    stdio: 'inherit'
  })

  const installedPath = `${process.cwd()}/node_modules/${fullPackageName}`

  if (!fs.existsSync(installedPath)) {
    throw new Error(`Failed to install ${fullPackageName}`)
  }

  fs.cpSync(installedPath, targetDir, { recursive: true })

  addWorkspaceDependency(fullPackageName)

  fs.rmSync(installedPath, { recursive: true, force: true })
  executeCommand('bun install', { cwd: process.cwd(), stdio: 'inherit' })
}

export default installAndMoveLocales
