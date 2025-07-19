import { z } from 'zod/v4'

import { LocationsCustomSchemas } from '../collections'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Locations = {
  getLocations: {
    query: z.object({
      q: z.string()
    }),
    response: z.array(LocationsCustomSchemas.Location)
  },
  checkIsEnabled: {
    response: z.boolean()
  }
}

type ILocations = InferApiESchemaDynamic<typeof Locations>

export type { ILocations }

export { Locations }
