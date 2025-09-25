import { z } from 'zod'

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
