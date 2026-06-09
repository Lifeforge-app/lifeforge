export const SHARED_PACKAGES = {
  '@lifeforge/api': {
    aliasRegex: /^@lifeforge\/api$/,
    entryPoint: '../packages/api/src/index.ts'
  },
  '@lifeforge/shared': {
    aliasRegex: /^@lifeforge\/shared$/,
    entryPoint: '../shared/src/index.ts'
  },
  '@lifeforge/federation': {
    aliasRegex: /^@lifeforge\/federation$/,
    entryPoint: '../packages/federation/src/index.ts'
  },
  '@lifeforge/ui': {
    aliasRegex: /^@lifeforge\/ui$/,
    entryPoint: '../packages/ui/src/index.ts'
  }
}
