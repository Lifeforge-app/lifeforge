import type { RecordModel } from 'pocketbase'

interface IMomentVaultEntry extends RecordModel {
  type: 'text' | 'audio' | 'video' | 'photo'
  content: string
  file?: string | undefined
  transcription: string
}

export type { IMomentVaultEntry }
