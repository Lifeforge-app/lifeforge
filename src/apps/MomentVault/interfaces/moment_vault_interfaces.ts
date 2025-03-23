import type { RecordModel } from 'pocketbase'

interface IMomentVaultEntry extends RecordModel {
  type: 'text' | 'audio' | 'video' | 'photos'
  content: string
  file?: string[]
  transcription: string
}

export type { IMomentVaultEntry }
