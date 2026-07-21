import { defineConfig } from 'vite'

import { serverAliasResolver } from '../resolvers/mod-server-alias-resolver'

/**
 * Creates a standard Vite configuration for module server-side builds.
 *
 * Auto-externalizes all npm/workspace packages (anything that doesn't
 * start with `./` or `../`) since modules run inside the core API server
 * process where all deps are already available in node_modules.
 */
export function defineModuleServerConfig(dirname: string) {
  return defineConfig({
    resolve: {
      alias: [
        { find: /^@\/(.*)$/, replacement: `${dirname}/$1` },
        { find: /^@$/, replacement: `${dirname}/index` }
      ]
    },
    plugins: [serverAliasResolver(dirname)],
    build: {
      lib: {
        entry: `${dirname}/index.ts`,
        formats: ['es']
      },
      outDir: `${dirname}/dist`,
      target: 'node22',
      rollupOptions: {
        output: {
          entryFileNames: 'index.js',
          banner:
            "import { createRequire as __createRequire } from 'node:module'; globalThis.require = __createRequire(import.meta.url);"
        }
      }
    }
  })
}
