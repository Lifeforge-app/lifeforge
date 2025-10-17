import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)

if (args.length !== 1) {
  console.error('Usage: ts-node scripts/hmmmm.ts <path-to-module>')
  process.exit(1)
}

const targetModulePath = path.resolve('./apps/', args[0])

if (
  !fs.existsSync(targetModulePath) ||
  !fs.lstatSync(targetModulePath).isDirectory()
) {
  console.error(`Error: Directory ${targetModulePath} does not exist.`)
  process.exit(1)
}

const packageJsonPath = path.join(targetModulePath, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
  console.error(`Error: package.json not found in ${targetModulePath}.`)
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

packageJson.scripts.types = 'cd client && bun tsc'
packageJson.dependencies = {
  ...packageJson.dependencies,
  'lifeforge-ui': 'workspace:*',
  shared: 'workspace:*'
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

try {
  execSync(`cd ${targetModulePath} && bun types`)
} catch (error: any) {
  const errMsg = error.output[1].toString()

  if (!errMsg.trim()) {
    console.log('No type errors found.')
    process.exit(0)
  }

  const allMatches = errMsg.matchAll(
    /Cannot find module '([^']+)' or its corresponding type declarations\./g
  )

  const missingModules = [
    ...Array.from([...new Set(Array.from(allMatches, m => m[1]))])
      .filter(moduleName => !['lifeforge-ui', 'shared'].includes(moduleName))
      .map(e =>
        e
          .split('/plugin/')[0]
          .replace(/\/dist\/.*/g, '')
          .replace('tailwindcss/colors', 'tailwindcss')
      ),
    'vite',
    'zod'
  ]

  if (missingModules.length === 0) {
    console.log('No missing module type declarations found.')
  } else {
    execSync(`cd ${targetModulePath} && bun add ${missingModules.join(' ')}`)
  }
}
