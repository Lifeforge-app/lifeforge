import type BasePBCollection from './pocketbase_interfaces'

interface IProjectsMCategory extends BasePBCollection {
  name: string
  icon: string
}

interface IProjectsMStatus extends BasePBCollection {
  name: string
  icon: string
  color: string
}

export type { IProjectsMCategory, IProjectsMStatus }
