import { TOOLS_ALLOWED } from '@/constants/constants'

const SERVICES = [
  'db',
  'server',
  'client',
  'ui',
  'docs',
  ...Object.keys(TOOLS_ALLOWED)
] as const

export default SERVICES
