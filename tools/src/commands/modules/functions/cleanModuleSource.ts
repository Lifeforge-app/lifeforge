import fs from 'fs'
import path from 'path'

/**
 * Removes source code from a module, keeping only the built bundles.
 * Preserves: client/dist, client/dist-docker, server/dist, package.json, locales
 */
export default function cleanModuleSource(targetDir: string): void {
  const clientDir = path.join(targetDir, 'client')

  const serverDir = path.join(targetDir, 'server')

  // Clean client directory - keep only dist and dist-docker
  if (fs.existsSync(clientDir)) {
    for (const item of fs.readdirSync(clientDir)) {
      if (item !== 'dist' && item !== 'dist-docker' && item !== 'assets') {
        const itemPath = path.join(clientDir, item)

        fs.rmSync(itemPath, { recursive: true, force: true })
      }
    }
  }

  // Clean server directory - keep only dist
  if (fs.existsSync(serverDir)) {
    for (const item of fs.readdirSync(serverDir)) {
      if (item !== 'dist') {
        const itemPath = path.join(serverDir, item)

        fs.rmSync(itemPath, { recursive: true, force: true })
      }
    }
  }

  // Remove git repository
  const gitDir = path.join(targetDir, '.git')

  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true })
  }

  // Remove other development files
  const devFiles = ['.gitignore', 'tsconfig.json', 'README.md']

  for (const file of devFiles) {
    const filePath = path.join(targetDir, file)

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { recursive: true, force: true })
    }
  }
}
