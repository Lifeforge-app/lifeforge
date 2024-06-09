interface IIdeaBoxContainer {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  image_count: number
  link_count: number
  name: string
  text_count: number
  updated: string
}

interface IIdeaBoxFolder {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  name: string
  updated: string
  containers: string
}

interface IIdeaBoxEntry {
  collectionId: string
  collectionName: string
  container: string
  content: string
  created: string
  id: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  updated: string
  pinned: boolean
  archived: boolean
}

export type { IIdeaBoxContainer, IIdeaBoxFolder, IIdeaBoxEntry }
