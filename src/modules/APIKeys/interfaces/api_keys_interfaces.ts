import type { RecordModel } from 'pocketbase'

interface IAPIKeyEntry extends RecordModel {
  keyId: string
  name: string
  description: string
  icon: string
  key: string
}

type IAPIKeyFormState = {
  keyId: string
  name: string
  description: string
  icon: string
  key: string
}

export type { IAPIKeyEntry, IAPIKeyFormState }
