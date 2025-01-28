import BasePBCollection from './pocketbase_interfaces'

interface IMailInboxEntry extends BasePBCollection {
  uid: string
  subject: string
  date: string
  text: string
  html: string
  seen: boolean
  from: {
    name: string
    address: string
  }
  to: {
    name: string
    address: string
  }[]
  cc: {
    name: string
    address: string
  }[]
  attachments: {
    name: string
    size: number
    file: string
  }[]
  unsubscribeUrl: string
}

interface IMailInboxLabel extends BasePBCollection {
  name: string
  amount: number
  parent: string
}

export type { IMailInboxEntry, IMailInboxLabel }
