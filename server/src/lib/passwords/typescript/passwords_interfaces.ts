import { z } from 'zod'

const PasswordsEntrySchema = z.object({
  color: z.string(),
  icon: z.string(),
  name: z.string(),
  password: z.string(),
  username: z.string(),
  website: z.string(),
  decrypted: z.string().optional(),
  pinned: z.boolean()
})

type IPasswordsEntry = z.infer<typeof PasswordsEntrySchema>

export type { IPasswordsEntry }

export { PasswordsEntrySchema }
