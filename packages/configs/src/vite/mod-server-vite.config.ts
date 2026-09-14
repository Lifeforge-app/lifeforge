import fs from 'node:fs'
import path from 'node:path'

import { defineConfig } from 'vite'

import { serverAliasResolver } from '../resolvers/mod-server-alias-resolver'

/**
 * Collects the module's entity files (a single `entity.ts` plus any
 * `schemas/*.entity.ts`) so they are emitted as standalone output files
 * alongside `index.js`, rather than being inlined into it.
 */
function getEntityInputs(serverDir: string): Record<string, string> {
  const inputs: Record<string, string> = {}

  const entityFile = path.join(serverDir, 'entity.ts')
  if (fs.existsSync(entityFile)) {
    inputs.entity = entityFile
  }

  const schemasDir = path.join(serverDir, 'schemas')
  if (fs.existsSync(schemasDir)) {
    const schemaEntityFiles = fs
      .readdirSync(schemasDir)
      .filter(name => name.endsWith('.entity.ts'))
      .sort()

    for (const name of schemaEntityFiles) {
      inputs[name.slice(0, -3)] = path.join(schemasDir, name)
    }
  }

  return inputs
}

/**
 * Creates a standard Vite configuration for module server-side builds.
 *
 * Auto-externalizes all npm/workspace packages (anything that doesn't
 * start with `./` or `../`) since modules run inside the core API server
 * process where all deps are already available in node_modules.
 */
export function defineModuleServerConfig(dirname: string) {
  const entityInputs = getEntityInputs(dirname)

  const input: Record<string, string> = {
    index: `${dirname}/index.ts`,
    ...entityInputs
  }

  return defineConfig({
    resolve: {
      alias: [
        { find: /^@\/(.*)$/, replacement: `${dirname}/$1` },
        { find: /^@$/, replacement: `${dirname}/index` }
      ]
    },
    plugins: [serverAliasResolver(dirname)],
    build: {
      minify: false,
      ssr: true,
      outDir: `${dirname}/dist`,
      target: 'node22',
      rollupOptions: {
        input,
        output: {
          banner:
            "import { createRequire as __createRequire } from 'node:module'; globalThis.require = __createRequire(import.meta.url);",
          entryFileNames(chunk) {
            if (chunk.name === 'index') return 'index.js'
            if (chunk.name === 'entity') return 'entity.js'
            return `schemas/${chunk.name}.js`
          }
        }
      }
    }
  })
}
