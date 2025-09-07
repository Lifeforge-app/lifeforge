export interface ModuleConfig {
  name: string
  icon: string
  provider?:
    | React.LazyExoticComponent<React.ComponentType<any>>
    | (() => React.ReactElement)
  routes: Record<
    string,
    | React.LazyExoticComponent<React.ComponentType<any>>
    | (() => React.ReactElement)
  >
  togglable: boolean
  hasAI?: boolean
  requiredAPIKeys?: string[]
  subsection?: {
    label: string
    icon: string
    path: string
  }[]
  hidden?: boolean
  forceDisable?: boolean
}

export interface ModuleCategory {
  title: string
  items: ModuleConfig[]
}
