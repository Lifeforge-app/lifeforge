import type { IFormState } from 'lifeforge-ui'

interface IBooksLibraryFormSate extends IFormState {
  authors: string
  collection: string
  edition: string
  extension: string
  isbn: string
  languages: string[]
  md5: string
  publisher: string
  size: string
  thumbnail: string
  title: string
  year_published: string
}

export type { IBooksLibraryFormSate }
