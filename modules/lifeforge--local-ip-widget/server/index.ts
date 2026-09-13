import os from 'os'
import z from 'zod'

import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import forge from './forge'

const getLocalIp = forge
  .query({
    description: 'Get local IP address',
    output: {
      OK: z.object({
        addresses: z.array(z.string())
      })
    }
  })
  .callback(async ({ response }) => {
    const interfaces = os.networkInterfaces()

    const addresses: string[] = []

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address)
        }
      }
    }

    return response.ok({ addresses })
  })

const routes = forgeRouter({ getLocalIp })

writeContractFileToClient(routes, import.meta.dirname)

export default routes
