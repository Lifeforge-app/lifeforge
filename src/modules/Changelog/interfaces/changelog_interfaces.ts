interface IChangeLogVersion {
  version: string
  date_range: [string, string]
  entries: IChangeLogEntry[]
}

interface IChangeLogEntry {
  id: string
  feature: string
  description: string
}

export type { IChangeLogEntry, IChangeLogVersion }
