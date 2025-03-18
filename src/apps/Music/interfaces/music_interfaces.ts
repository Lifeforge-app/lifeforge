import type { RecordModel } from 'pocketbase'

interface IMusicEntry extends RecordModel {
  name: string
  author: string
  duration: string
  file: string
  is_favourite: boolean
}

export type { IMusicEntry }
