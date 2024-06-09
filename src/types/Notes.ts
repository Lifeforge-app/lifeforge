interface INotesWorkspace {
  collectionId: string
  collectionName: string
  created: string
  icon: string
  id: string
  name: string
  updated: string
}

interface INotesSubject {
  workspace: string
  collectionId: string
  collectionName: string
  created: string
  description: string
  icon: string
  id: string
  title: string
  updated: string
}

interface INotesEntry {
  collectionId: string
  collectionName: string
  created: string
  id: string
  name: string
  path: string
  subject: string
  type: 'file' | 'folder'
  updated: string
  file: string
}

interface INotesPath {
  id: string
  name: string
}

export type { INotesWorkspace, INotesSubject, INotesEntry, INotesPath }
