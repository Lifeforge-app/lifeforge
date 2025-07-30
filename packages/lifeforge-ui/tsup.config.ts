import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/styles/index.css'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  external: ['../../server/src/core/appRoutes.type'],
  minify: true,
  clean: true
})
