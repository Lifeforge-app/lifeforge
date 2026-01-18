import z from 'zod'

const CategorySchema = z.enum([
  'display',
  'handwriting',
  'monospace',
  'sans-serif',
  'serif'
])

const ColorCapabilitySchema = z.enum(['COLRv0', 'COLRv1', 'SVG'])

const KindSchema = z.enum(['webfonts#webfont'])

const FilesSchema = z.object({
  regular: z.string().optional(),
  italic: z.string().optional(),
  '500': z.string().optional(),
  '600': z.string().optional(),
  '700': z.string().optional(),
  '800': z.string().optional(),
  '100': z.string().optional(),
  '200': z.string().optional(),
  '300': z.string().optional(),
  '900': z.string().optional(),
  '100italic': z.string().optional(),
  '200italic': z.string().optional(),
  '300italic': z.string().optional(),
  '500italic': z.string().optional(),
  '600italic': z.string().optional(),
  '700italic': z.string().optional(),
  '800italic': z.string().optional(),
  '900italic': z.string().optional()
})

const FontFamilySchema = z.object({
  family: z.string(),
  variants: z.array(z.string()),
  subsets: z.array(z.string()),
  version: z.string(),
  lastModified: z.coerce.date(),
  files: FilesSchema,
  category: CategorySchema,
  kind: KindSchema,
  menu: z.string(),
  colorCapabilities: z.array(ColorCapabilitySchema).optional()
})

// For getGoogleFont response
const GetGoogleFontResponseSchema = z.object({
  enabled: z.boolean(),
  items: z.array(FontFamilySchema).optional()
})

export default GetGoogleFontResponseSchema
