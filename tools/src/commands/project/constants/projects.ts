export const PROJECTS = {
  ui: 'packages/ui',
  client: 'client',
  server: 'server',
  docs: 'docs',
  forgeCLI: 'tools'
} as const

export type ProjectType = keyof typeof PROJECTS
