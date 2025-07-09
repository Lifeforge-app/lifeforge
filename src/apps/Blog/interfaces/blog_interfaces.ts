import { RecordModel } from 'pocketbase'

interface IBlogEntry extends RecordModel {
  title: string
  content: string
  media: string[]
  excerpt: string
  visibility: 'public' | 'private' | 'unlisted'
  featured_image: string
  labels: string[]
  category: string
}

interface IBlogEntryFormState {
  title: string
  excerpt: string
  visibility: 'public' | 'private' | 'unlisted'
  featuredImage: File | string | null
  featuredImagePreview: string | null
  category: string | null
  labels: string[]
}

export type { IBlogEntry, IBlogEntryFormState }
