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

interface IIdeaBoxFolder extends BasePBCollection {
  color: string
  icon: string
  name: string
  containers: string
  parent: string
}

interface IIdeaBoxEntry extends BasePBCollection {
  container: string
  content: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  pinned: boolean
  archived: boolean
}

export type { IIdeaBoxContainer, IIdeaBoxEntry, IIdeaBoxFolder }
