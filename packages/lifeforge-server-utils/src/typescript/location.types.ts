import { number, object, string } from 'zod'

const LocationSchema = object({
  name: string(),
  formattedAddress: string(),
  location: object({
    latitude: number(),
    longitude: number()
  })
})

type Location = {
  name: string
  formattedAddress: string
  location: {
    latitude: number
    longitude: number
  }
}

export type { Location }

export { LocationSchema }
