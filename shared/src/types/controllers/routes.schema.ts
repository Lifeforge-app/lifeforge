import z from 'zod/v4'

import { RouteCustomSchemas } from '../collections'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Routes = {
  getAllRoutes: {
    response: z.array(RouteCustomSchemas.Route)
  }
}

type IRoutes = InferApiESchemaDynamic<typeof Routes>

export type { IRoutes }

export { Routes }
