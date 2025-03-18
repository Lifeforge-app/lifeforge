import type { RecordModel } from 'pocketbase'

interface IIdeaBoxContainer extends RecordModel {
  name: string
  color: string
  icon: string
  cover: string
  image_count: number
  link_count: number
  text_count: number
}

interface IIdeaBoxContainerFormState {
  name: string
  color: string
  icon: string
  cover: {
    image: string | File | null
    preview: string | null
  }
}

interface IIdeaBoxFolder extends RecordModel {
  color: string
  icon: string
  name: string
  containers: string
  parent: string
}

interface IIdeaBoxFolderFormState {
  name: string
  color: string
  icon: string
}

interface IIdeaBoxEntry extends RecordModel {
  folder: string | IIdeaBoxFolder
  container: string
  content: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  tags?: string[]
  pinned: boolean
  archived: boolean
  fullPath?: string
}

interface IIdeaBoxTag extends RecordModel {
  name: string
  color: string
  icon: string
  container: string
  count: number
}

interface IIdeaBoxTagFormState {
  name: string
  color: string
  icon: string
}

export type {
  IIdeaBoxContainer,
  IIdeaBoxContainerFormState,
  IIdeaBoxEntry,
  IIdeaBoxFolder,
  IIdeaBoxFolderFormState,
  IIdeaBoxTag,
  IIdeaBoxTagFormState
}
