import type BasePBCollection from '@interfaces/pb_interfaces'

interface IAPIKeyEntry extends BasePBCollection {
  keyId: string
  name: string
  description: string
  icon: string
  key: string
}

type IAPIKeyFormState = Omit<IAPIKeyEntry, keyof BasePBCollection>

export type { IAPIKeyEntry, IAPIKeyFormState }
