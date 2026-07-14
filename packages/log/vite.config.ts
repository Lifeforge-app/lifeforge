import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        'loggers/cliLogger': './src/loggers/cliLogger.ts'
      },
      formats: ['es']
    },
    outDir: 'dist',
    target: 'node22',
    rollupOptions: {
      output: { entryFileNames: '[name].js' },
      external: [/^[^./]/]
    }
  }
})
