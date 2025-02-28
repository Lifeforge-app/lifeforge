import BasePBCollection from './pocketbase_interfaces'

interface IMomentVaultEntry extends BasePBCollection {
  type: 'text' | 'audio' | 'video' | 'photo'
  content: string
  file?: string | undefined
  transcription: string
}

export type { IMomentVaultEntry }
