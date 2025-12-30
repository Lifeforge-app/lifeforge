export const COMMANDS = ['build', 'types', 'lint'] as const

export type CommandType = (typeof COMMANDS)[number]
