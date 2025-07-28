import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    '!src/**/*.stories.*',
    '!src/stories/**',
    '!scripts/**',
    'src/index.ts',
    'src/styles/index.css'
  ],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  external: ['../../server/src/core/appRoutes.type'],
  minify: true,
  dts: true,
  clean: true
})
