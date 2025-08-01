import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/styles/index.css'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  external: ['../../server/src/core/routes/routes.type'],
  minify: true,
  clean: true
})
