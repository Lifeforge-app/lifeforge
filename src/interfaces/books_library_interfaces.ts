import type BasePBCollection from './pocketbase_interfaces'

export interface IBooksLibraryEntry extends BasePBCollection {
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

interface IBooksLibraryCategory extends BasePBCollection {
  name: string
  icon: string
}

interface IBooksLibraryLanguage extends BasePBCollection {
  name: string
  icon: string
}

export type { IBooksLibraryCategory, IBooksLibraryLanguage }
