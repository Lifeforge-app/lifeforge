import { defineConfig } from 'tsup'

export default defineConfig({
  outDir: 'dist',
  format: ['esm', 'cjs'],
  external: ['../../server/src/core/routes/routes.type'],
  minify: true,
  clean: true
})
