export type GoogleFontCategory =
  'display' | 'handwriting' | 'monospace' | 'sans-serif' | 'serif'

export type GoogleFontColorCapability = 'COLRv0' | 'COLRv1' | 'SVG'

export interface GoogleFontFiles {
  regular?: string
  italic?: string
  '100'?: string
  '200'?: string
  '300'?: string
  '500'?: string
  '600'?: string
  '700'?: string
  '800'?: string
  '900'?: string
  '100italic'?: string
  '200italic'?: string
  '300italic'?: string
  '500italic'?: string
  '600italic'?: string
  '700italic'?: string
  '800italic'?: string
  '900italic'?: string
}

export interface GoogleFontFamily {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: GoogleFontFiles
  category: GoogleFontCategory
  kind: 'webfonts#webfont'
  menu: string
  colorCapabilities?: GoogleFontColorCapability[]
}

export interface GetGoogleFontResponse {
  enabled: boolean
  items?: GoogleFontFamily[]
}
