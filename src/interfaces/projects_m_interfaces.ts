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

interface IProjectsMVisibility extends BasePBCollection {
  name: string
  icon: string
}

interface IProjectsMTechnology extends BasePBCollection {
  name: string
  icon: string
}

export type {
  IProjectsMCategory,
  IProjectsMStatus,
  IProjectsMVisibility,
  IProjectsMTechnology
}
