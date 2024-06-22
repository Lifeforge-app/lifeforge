import type BasePBCollection from './pocketbase_interfaces'

interface IProjectsMEntry extends BasePBCollection {
  name: string
  icon: string
  color: string
  category: string
  status: string
  visibility: string
  technologies: string[]
}

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
  IProjectsMEntry,
  IProjectsMCategory,
  IProjectsMStatus,
  IProjectsMVisibility,
  IProjectsMTechnology
}
