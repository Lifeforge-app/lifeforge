import { z } from 'zod/v4'

import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Modules = {
  /**
   * @route       GET /paths
   * @description List all application paths
   */
  listAppPaths: {
    response: z.array(z.string())
  },

  /**
   * @route       POST /toggle/:id
   * @description Toggle a module on/off
   */
  toggleModule: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  },

  /**
   * @route       POST /package/:id
   * @description Package a module into a zip file
   */
  packageModule: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  },

  /**
   * @route       POST /install
   * @description Install a module from uploaded file
   */
  installModule: {
    body: z.object({
      name: z.string().min(1, 'Name is required')
    }),
    response: z.void()
  }
}

type IModules = InferApiESchemaDynamic<typeof Modules>

export type { IModules }

export { Modules }
