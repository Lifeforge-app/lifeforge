export interface RouteItem {
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
  subsection?: [string, string, string][]
  hidden?: boolean
}

export interface RouteCategory {
  title: string
  items: RouteItem[]
}
