interface IBlogEntryFormState {
  title: string
  excerpt: string
  visibility: 'public' | 'private' | 'unlisted'
  featuredImage: File | string | null
  featuredImagePreview: string | null
  category: string | null
  labels: string[]
}

export type { IBlogEntryFormState }
