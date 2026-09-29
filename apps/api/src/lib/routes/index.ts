import z from 'zod'

import {
  ModuleRegistry,
  createForge,
  forgeRouter,
  traceRouteStack
} from '@lifeforge/server-utils'

const forge = createForge({}, 'routes')

const list = forge
  .query({
    description: 'List all registered routes',
    input: {},
    output: {
      OK: z.record(
        z.string(),
        z.object({
          displayName: z.string(),
          icon: z.string(),
          routes: z.array(
            z.object({
              method: z.string(),
              path: z.string(),
              description: z.string(),
              noAuth: z.boolean(),
              encrypted: z.boolean(),
              isDownloadable: z.boolean(),
              media: z.any().nullable(),
              input: z.any(),
              output: z.any()
            })
          )
        })
      )
    }
  })
  .callback(async ({ req, response }) => {
    const modules = new Map(ModuleRegistry.list.map(m => [m.moduleId, m]))
    const modulesByName = new Map(
      ModuleRegistry.list.map(m => [
        m.name.replace(/^@lifeforge\//, ''),
        m.moduleId
      ])
    )

    const groups: Record<
      string,
      {
        displayName: string
        icon: string
        routes: {
          method: string
          path: string
          description: string
          noAuth: boolean
          encrypted: boolean
          isDownloadable: boolean
          media: unknown
          input: unknown
          output: unknown
        }[]
      }
    > = {
      core: { displayName: 'Core', icon: 'tabler:box', routes: [] }
    }

    const buildEndpoint = (
      route: ReturnType<typeof traceRouteStack>[number],
      path: string
    ) => ({
      method: route.method,
      path,
      description: route.description,
      noAuth: route.noAuth ?? false,
      encrypted: route.encrypted ?? false,
      isDownloadable: route.isDownloadable ?? false,
      media: route.media ?? null,
      input: route.input ?? {},
      output: route.output ?? 'custom'
    })

    const seen = new Set<string>()

    for (const route of traceRouteStack(req.app._router.stack)) {
      const match = route.path.match(/^modules\/([a-f0-9]{64})(?:\/(.*))?$/)

      let moduleId = match?.[1]
      let relativePath = match ? (match[2] ?? '') : route.path

      if (!match && route.callerModule?.source === 'app') {
        moduleId = modulesByName.get(route.callerModule.id)
        relativePath = route.path.split('/').slice(1).join('/')
      }

      const module = moduleId ? modules.get(moduleId) : undefined

      if (!module) {
        groups.core.routes.push(buildEndpoint(route, route.path))

        continue
      }

      const key = `${module.moduleId}|${route.method}|${relativePath}`

      if (seen.has(key)) {
        continue
      }

      seen.add(key)

      groups[module.moduleId] ??= {
        displayName: module.displayName,
        icon: module.icon,
        routes: []
      }

      groups[module.moduleId].routes.push(buildEndpoint(route, relativePath))
    }

    return response.ok(groups)
  })

export default forgeRouter({ list })
