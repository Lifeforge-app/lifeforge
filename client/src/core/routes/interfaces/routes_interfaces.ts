export interface ModuleConfig {
  name: string
  icon: React.ReactElement | string
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
    icon: React.ReactElement | string
    path: string
  }[]
  hidden?: boolean
  forceDisable?: boolean
}

export interface ModuleCategory {
  title: string
  items: ModuleConfig[]
}
