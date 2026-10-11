import express from 'express'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import { createModuleRuntime } from './createModuleRuntime'

interface RouteLayer {
  route?: { path?: string }
}

interface RouterLike {
  stack?: RouteLayer[]
}

function findMountedRouter(outer: express.Router): RouterLike | undefined {
  for (const layer of outer.stack) {
    const handle = layer.handle as unknown as RouterLike

    if (Array.isArray(handle.stack)) {
      return handle
    }
  }

  return undefined
}

describe('createModuleRuntime', () => {
  const modulesDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'module-runtime-')
  )

  afterEach(() => {
    fs.rmSync(modulesDir, { recursive: true, force: true })
  })

  it('mounts a placeholder and swaps it with built routes on reload', async () => {
    const outer = express.Router()

    let buildCount = 0

    const runtime = createModuleRuntime({
      modulesDir,
      isProduction: false,
      outerRouter: outer,
      buildRouter: () => {
        buildCount++

        const router = express.Router()

        router.get('/ping', (_req, res) => res.end('pong'))

        return router
      }
    })

    await runtime.reload()

    expect(buildCount).toBe(1)

    const mounted = findMountedRouter(outer)

    const paths = (mounted?.stack ?? [])
      .map(layer => layer.route?.path)
      .filter(Boolean)

    expect(paths).toContain('/ping')

    runtime.dispose()
  })

  it('coalesces concurrent reloads', async () => {
    const outer = express.Router()

    let buildCount = 0

    const runtime = createModuleRuntime({
      modulesDir,
      isProduction: false,
      outerRouter: outer,
      buildRouter: () => {
        buildCount++

        return express.Router()
      }
    })

    await Promise.all([runtime.reload(), runtime.reload(), runtime.reload()])

    expect(buildCount).toBe(1)

    runtime.dispose()
  })
})
