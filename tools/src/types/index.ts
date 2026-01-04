import type { IOType } from 'child_process'

export interface ProjectConfig {
  path: string
  displayName?: string
}

export interface ServiceConfig extends ProjectConfig {
  command?: string
  cwd?: string
}

export interface CommandExecutionOptions {
  stdio?: IOType | [IOType, IOType, IOType]
  cwd?: string
  env?: Record<string, string>
  exitOnError?: boolean
}
