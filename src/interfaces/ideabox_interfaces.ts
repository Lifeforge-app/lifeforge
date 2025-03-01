import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IIdeaBoxContainer extends BasePBCollection {
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

interface IIdeaBoxFolder extends BasePBCollection {
  color: string
  icon: string
  name: string
  containers: string
  parent: string
}

interface IIdeaBoxEntry extends BasePBCollection {
  folder: string | IIdeaBoxFolder
  container: string
  content: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  tags?: string[]
  pinned: boolean
  archived: boolean
}

interface IIdeaBoxTag extends BasePBCollection {
  name: string
  color: string
  icon: string
  container: string
  count: number
}

export type {
  IIdeaBoxContainer,
  IIdeaBoxContainerFormState,
  IIdeaBoxEntry,
  IIdeaBoxFolder,
  IIdeaBoxTag
}
