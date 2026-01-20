#!/usr/bin/env bun
/**
 * Script to add build:server script to all module package.json files
 */
import fs from 'fs'
import path from 'path'

// Resolve from the lifeforge root (where this script is run from)
const ROOT_DIR = process.cwd()

const APPS_DIR = path.resolve(ROOT_DIR, 'apps')

const BUILD_SERVER_SCRIPT =
  'bun build ./server/index.ts --outdir ./server/dist --target bun --external @lifeforge/server-utils --external zod'

async function main() {
  const moduleDirs = fs.readdirSync(APPS_DIR).filter(name => {
    const fullPath = path.join(APPS_DIR, name)

    return (
      fs.statSync(fullPath).isDirectory() &&
      !name.startsWith('.') &&
      name !== 'node_modules'
    )
  })

  let updatedCount = 0
  let skippedCount = 0
  let noServerCount = 0

  for (const moduleName of moduleDirs) {
    const moduleDir = path.join(APPS_DIR, moduleName)

    const packageJsonPath = path.join(moduleDir, 'package.json')

    const serverIndexPath = path.join(moduleDir, 'server', 'index.ts')

    // Check if server/index.ts exists
    if (!fs.existsSync(serverIndexPath)) {
      console.log(`⏭️  Skipping ${moduleName} (no server/index.ts)`)
      noServerCount++
      continue
    }

    if (!fs.existsSync(packageJsonPath)) {
      console.log(`⚠️  ${moduleName}: No package.json found`)
      skippedCount++
      continue
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // Initialize scripts if not present
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    // Check if build:server already exists
    if (packageJson.scripts['build:server']) {
      console.log(`⏭️  ${moduleName}: build:server already exists`)
      skippedCount++
      continue
    }

    // Add build:server script
    packageJson.scripts['build:server'] = BUILD_SERVER_SCRIPT

    // Write back
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    )
    console.log(`✅ ${moduleName}: Added build:server script`)
    updatedCount++
  }

  console.log('\n--- Summary ---')
  console.log(`Updated: ${updatedCount}`)
  console.log(
    `Skipped (already had script or no package.json): ${skippedCount}`
  )
  console.log(`Skipped (no server): ${noServerCount}`)
}

main().catch(console.error)
