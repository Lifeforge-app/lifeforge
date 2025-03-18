import type { RecordModel } from 'pocketbase'

interface IProjectsMEntry extends RecordModel {
  name: string
  icon: string
  color: string
  category: string
  status: string
  visibility: string
  technologies: string[]
}

interface IProjectsMCategory extends RecordModel {
  name: string
  icon: string
}

interface IProjectsMStatus extends RecordModel {
  name: string
  icon: string
  color: string
}

interface IProjectsMVisibility extends RecordModel {
  name: string
  icon: string
}

interface IProjectsMTechnology extends RecordModel {
  name: string
  icon: string
}

interface IProjectsMKanbanEntry extends RecordModel {
  title: string
}

interface IProjectsMKanbanColumn extends RecordModel {
  name: string
  icon: string
  color: string
  entries?: IProjectsMKanbanEntry[]
}

export type {
  IProjectsMCategory,
  IProjectsMEntry,
  IProjectsMKanbanColumn,
  IProjectsMStatus,
  IProjectsMTechnology,
  IProjectsMVisibility
}
