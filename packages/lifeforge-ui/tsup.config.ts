import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['!src/**/*.stories.*', '!src/stories/**', '!scripts/**'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  minify: true,
  dts: true,
  clean: true
})
