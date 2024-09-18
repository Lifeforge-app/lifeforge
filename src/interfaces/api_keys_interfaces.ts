import type BasePBCollection from './pocketbase_interfaces'

interface APIKeyEntry extends BasePBCollection {
  keyId: string
  name: string
  description: string
  icon: string
  key: string
}

export type { APIKeyEntry }
