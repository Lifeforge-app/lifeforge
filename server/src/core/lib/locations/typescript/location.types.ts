import { z } from 'zod/v4'

const Location = z.object({
  name: z.string(),
  formattedAddress: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  })
})

type ILocation = z.infer<typeof Location>

export type { ILocation }

export { Location }
