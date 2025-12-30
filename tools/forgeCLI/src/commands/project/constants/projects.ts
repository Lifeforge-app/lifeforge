import { TOOLS_ALLOWED } from '@/constants/constants'

export const PROJECTS = {
  shared: 'shared',
  ui: 'packages/lifeforge-ui',
  client: 'client',
  server: 'server',
  docs: 'docs',
  ...TOOLS_ALLOWED
} as const

export type ProjectType = keyof typeof PROJECTS
