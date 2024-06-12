import type BasePBCollection from '@interfaces/pocketbase_interfaces'

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
