export interface ProjectConfig {
  path: string
  displayName?: string
}

export interface ServiceConfig extends ProjectConfig {
  command?: string
  cwd?: string
}

export interface CommandExecutionOptions {
  stdio?: 'inherit' | 'pipe'
  cwd?: string
  env?: Record<string, string>
}

export interface ConcurrentServiceConfig {
  name: string
  command: string
  cwd?: string
  color?: string
}

// Re-export types from constants
export type {
  ProjectType,
  ServiceType,
  CommandType
} from '../constants/constants'
