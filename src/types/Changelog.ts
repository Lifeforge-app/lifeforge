import type BasePBCollection from './Pocketbase'

interface IChangeLogVersion extends BasePBCollection {
  version: string
  date_range: [string, string]
  entries: IChangeLogEntry[]
}

interface IChangeLogEntry extends BasePBCollection {
  feature: string
  description: string
}

export type { IChangeLogVersion, IChangeLogEntry }
