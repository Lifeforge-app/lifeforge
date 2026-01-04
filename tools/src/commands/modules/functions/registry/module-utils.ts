import fs from 'fs'
import path from 'path'

const LIFEFORGE_SCOPE = '@lifeforge/'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function getLifeforgeModules(): string[] {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  )

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }

  return Object.keys(allDeps)
    .filter(dep => dep.startsWith(LIFEFORGE_SCOPE))
    .filter(dep => !dep.replace(LIFEFORGE_SCOPE, '').startsWith('lang-'))
}

export function extractModuleName(packageName: string): string {
  const withoutScope = packageName.replace(LIFEFORGE_SCOPE, '')

  if (withoutScope.startsWith('lifeforge--')) {
    return withoutScope.replace('lifeforge--', '')
  }

  return withoutScope
}

export function getModulePath(packageName: string): string | null {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules', packageName)

  try {
    const realPath = fs.realpathSync(nodeModulesPath)

    if (realPath.includes('/apps/')) {
      return realPath
    }

    return nodeModulesPath
  } catch {
    return null
  }
}

export function moduleHasSchema(packageName: string): boolean {
  const modulePath = getModulePath(packageName)

  if (!modulePath) {
    return false
  }

  const schemaPath = path.join(modulePath, 'server', 'schema.ts')

  return fs.existsSync(schemaPath)
}

export function moduleHasServer(packageName: string): boolean {
  const modulePath = getModulePath(packageName)

  if (!modulePath) {
    return false
  }

  const serverPath = path.join(modulePath, 'server', 'index.ts')

  return fs.existsSync(serverPath)
}
