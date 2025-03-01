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

interface IPasswordFormData {
  name: string
  icon: string
  color: string
  website: string
  username: string
  password: string
}

export type { IPasswordEntry, IPasswordFormData }
