import type { FormState } from 'lifeforge-ui'
import type { RecordModel } from 'pocketbase'

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

interface IPasswordFormState extends FormState {
  name: string
  icon: string
  color: string
  website: string
  username: string
  password: string
}

export type { IPasswordEntry, IPasswordFormState }
