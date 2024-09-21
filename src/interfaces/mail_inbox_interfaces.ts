interface IMailInboxEntry {
  id: number
  from: string
  subject: string
  date: string
  seen: boolean
}

export type { IMailInboxEntry }
