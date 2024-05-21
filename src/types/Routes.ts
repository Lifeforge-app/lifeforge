interface IRoutesItem {
  name: string
  icon: string
  routes: Record<string, string>
  provider?: string
  subsection?: string[][]
  togglable: boolean
}

export interface IRoutes {
  title: string
  items: IRoutesItem[]
}
