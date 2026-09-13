import express from 'express'
import { afterEach, describe, expect, it } from 'vitest'

import { registerRoutes } from './forgeRouter'

describe('registerRoutes', () => {
  let server: ReturnType<ReturnType<typeof express>['listen']> | undefined

  afterEach(() => {
    server?.close()
    server = undefined
  })

  it('mounts callable Express routers', async () => {
    const childRouter = express.Router()
    childRouter.get('/health', (_, response) => response.send('ok'))
    const app = express().use(registerRoutes({ board: childRouter } as never))

    server = app.listen(0)
    await new Promise<void>((resolve, reject) => {
      server?.once('listening', resolve)
      server?.once('error', reject)
    })

    const address = server.address()

    if (!address || typeof address === 'string')
      throw new Error('Server did not start')

    const response = await fetch(
      `http://127.0.0.1:${address.port}/board/health`
    )

    expect(response.status).toBe(200)
    await expect(response.text()).resolves.toBe('ok')
  })
})
