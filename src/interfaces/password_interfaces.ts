import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IPasswordEntry extends BasePBCollection {
  color: string
  icon: string
  name: string
  password: string
  username: string
  website: string
  decrypted?: string
  pinned: boolean
}

export type { IPasswordEntry }
