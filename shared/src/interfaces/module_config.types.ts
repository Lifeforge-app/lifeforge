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
  hasAI?: boolean
  apiAccess?: { key: string; usage: string; required: boolean }[]
  subsection?: {
    label: string
    icon: string
    path: string
  }[]
  hidden?: boolean
  disabled?: boolean
  category?: string
  clearQueryOnUnmount?: boolean
}

export interface ModuleCategory {
  title: string
  items: ModuleConfig[]
}
