import { TOOLS_ALLOWED } from '@/commands/project/constants/projects'

const SERVICES = [
  'db',
  'server',
  'client',
  'ui',
  'docs',
  ...Object.keys(TOOLS_ALLOWED)
] as const

export default SERVICES
