import type BasePBCollection from '@interfaces/pb_interfaces'

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

interface IPasswordFormState {
  name: string
  icon: string
  color: string
  website: string
  username: string
  password: string
}

export type { IPasswordEntry, IPasswordFormState }
