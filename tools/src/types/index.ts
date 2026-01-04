
export interface ProjectConfig {
  path: string
  displayName?: string
}

export interface ServiceConfig extends ProjectConfig {
  command?: string
  cwd?: string
}
