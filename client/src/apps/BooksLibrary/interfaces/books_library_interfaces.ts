import type { IFormState } from 'lifeforge-ui'
import type { RecordModel } from 'pocketbase'

interface IBooksLibraryEntry extends RecordModel {
  md5: string
  authors: string
  collection: string
  edition: string
  extension: string
  file: string
  isbn: string
  languages: string[]
  publisher: string
  size: number
  thumbnail: string
  title: string
  year_published: number
  is_favourite: boolean
  is_read: boolean
}

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

interface IBooksLibraryCollection extends RecordModel {
  name: string
  icon: string
  amount: number
}

interface IBooksLibraryLanguage extends RecordModel {
  name: string
  icon: string
  amount: number
}

interface IBooksLibraryFileType extends RecordModel {
  name: string
  icon: never
  amount: number
}

export type {
  IBooksLibraryEntry,
  IBooksLibraryFormSate,
  IBooksLibraryCollection,
  IBooksLibraryLanguage,
  IBooksLibraryFileType
}
