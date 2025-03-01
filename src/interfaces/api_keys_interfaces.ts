import type BasePBCollection from './pocketbase_interfaces'

interface IAPIKeyEntry extends BasePBCollection {
  keyId: string
  name: string
  description: string
  icon: string
  key: string
}

interface IAPIKeyFormState {
  id: string
  name: string
  description: string
  icon: string
  key: string
}

export type { IAPIKeyEntry, IAPIKeyFormState }
