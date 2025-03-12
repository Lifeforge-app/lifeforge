import BasePBCollection from '../../../core/interfaces/pb_interfaces'

interface IMomentVaultEntry extends BasePBCollection {
  type: 'text' | 'audio' | 'video' | 'photo'
  content: string
  file?: string | undefined
  transcription: string
}

export type { IMomentVaultEntry }
