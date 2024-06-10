import type BasePBCollection from './Pocketbase'

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
