import fs from 'node:fs'
import path from 'node:path'

export function findProjectRoot(startDir?: string): string {
  const dirsToTry = [
    process.env.ROOT_DIR,
    startDir,
    process.cwd(),
    typeof import.meta.dirname === 'string' ? import.meta.dirname : undefined
  ].filter((d): d is string => Boolean(d))

  for (const dir of dirsToTry) {
    let current = path.resolve(dir)
    while (true) {
      if (
        fs.existsSync(path.join(current, 'pnpm-workspace.yaml')) ||
        fs.existsSync(path.join(current, 'pnpm-lock.yaml')) ||
        fs.existsSync(path.join(current, '.git'))
      ) {
        return current
      }
      const parent = path.dirname(current)
      if (parent === current) {
        break
      }
      current = parent
    }
  }

  return process.cwd()
}
