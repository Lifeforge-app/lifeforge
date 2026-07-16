import { defineConfig } from 'vite'

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
    build: {
      lib: {
        entry: `${dirname}/index.ts`,
        formats: ['es']
      },
      outDir: `${dirname}/dist`,
      target: 'node22',
      rollupOptions: {
        output: { entryFileNames: 'index.js' },
        external: [/^[^./]/]
      }
    }
  })
}
