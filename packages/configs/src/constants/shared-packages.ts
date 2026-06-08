export const SHARED_PACKAGES = {
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
