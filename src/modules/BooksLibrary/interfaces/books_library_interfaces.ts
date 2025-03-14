import type BasePBCollection from '@interfaces/pb_interfaces'

interface IBooksLibraryEntry extends BasePBCollection {
  md5: string
  authors: string
  category: string
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
}

interface IBooksLibraryFormSate {
  authors: string
  category: string
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

interface IBooksLibraryCategory extends BasePBCollection {
  name: string
  icon: string
  count: number
}

interface IBooksLibraryLanguage extends BasePBCollection {
  name: string
  icon: string
  count: number
}

interface IBooksLibraryFileType extends BasePBCollection {
  name: string
  icon: never
  count: number
}

export type {
  IBooksLibraryEntry,
  IBooksLibraryFormSate,
  IBooksLibraryCategory,
  IBooksLibraryLanguage,
  IBooksLibraryFileType
}
