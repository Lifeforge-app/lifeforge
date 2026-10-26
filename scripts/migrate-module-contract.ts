/**
 * Codemod: migrate a LifeForge module manifest from the old runtime contract
 * to a type-only contract.
 *
 * Run from the lifeforge monorepo against a cloned module repo:
 *
 *   pnpm exec tsx scripts/migrate-module-contract.ts /path/to/lifeforge-module-x
 *
 * The module's `client/contract.ts` is regenerated as a type-only declaration
 * the next time its dev server starts, so this script only updates the
 * manifest:
 *   - `import type { Contract } from './contract'`
 *   - `createForgeModule<Contract>({ ... })`
 *   - removes the `contract` prop
 *
 * Idempotent: an already-migrated manifest is left untouched.
 */
import fs from 'fs'
import path from 'path'

function patchManifest(source: string): string {
  let next = source

  if (!next.includes("import type { Contract } from './contract'")) {
    next = next.replace(
      "import { createForgeModule } from '@lifeforge/federation'",
      "import { createForgeModule } from '@lifeforge/federation'\n\nimport type { Contract } from './contract'"
    )
  }

  next = next.replace(/import contract from '\.\/contract'\n\n?/, '')
  next = next.replace('createForgeModule({', 'createForgeModule<Contract>({')
  next = next.replace(/,\n\s*contract\n\}\)/, '\n})')

  return next
}

function main(): void {
  const target = process.argv[2]

  if (!target) {
    throw new Error('Usage: migrate-module-contract.ts <module-repo-root>')
  }

  const manifestPath = path.join(path.resolve(target), 'client', 'manifest.ts')

  const source = fs.readFileSync(manifestPath, 'utf8')

  if (source.includes('createForgeModule<Contract>')) {
    console.log(`${target}: already migrated, skipping`)

    return
  }

  fs.writeFileSync(manifestPath, patchManifest(source))

  console.log(`${target}: manifest migrated`)
}

main()
