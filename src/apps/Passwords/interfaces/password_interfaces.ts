import type { RecordModel } from 'pocketbase'

import type { IFormState } from '@lifeforge/ui'

interface IPasswordEntry extends RecordModel {
  color: string
  icon: string
  name: string
  password: string
  username: string
  website: string
  decrypted?: string
  pinned: boolean
}

interface IPasswordFormState extends IFormState {
  name: string
  icon: string
  color: string
  website: string
  username: string
  password: string
}

export type { IPasswordEntry, IPasswordFormState }
