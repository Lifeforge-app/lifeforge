import { z } from 'zod'

interface Route {
  method: string
  path: string
  description: string
  schema: {
    response: z.ZodTypeAny
    params?: z.ZodTypeAny
    body?: z.ZodTypeAny
    query?: z.ZodTypeAny
  }
}

export default function traceRouteStack(
  stack: any,
  path = '',
  routes: Route[] = []
) {
  for (const layer of stack) {
    if (layer.handle.name === 'router') {
      const pathName =
        layer.regexp
          .toString()
          .match(/\/\^\\\/(.*?)\\\/\?\(\?\=\\\/\|\$\)\/i/)?.[1] ?? ''

      const fullPath = [path, pathName].filter(Boolean).join('/')

      traceRouteStack(layer.handle.stack, fullPath, routes)
    }

    if (layer.handle.name === 'bound dispatch') {
      const method = layer.route?.methods || {}

      const methods = Object.keys(method).filter(m => method[m])

      const routePath = [path, layer.route?.path || '']
        .filter(Boolean)
        .join('/')
        .replace(/\/+/g, '/')
        .replace(/\\\//g, '/')

      const route: Route = {
        method: methods[0].toUpperCase(),
        path: routePath,
        schema: {
          response: z.void()
        },
        description: ''
      }

      routes.push(route)

      const stack = layer.route?.stack || []

      const controllerLayerMeta = stack[stack.length - 1].handle.meta

      if (!controllerLayerMeta) {
        continue
      }

      route.description = controllerLayerMeta.description
      route.schema = controllerLayerMeta.schema
    }
  }

  return routes
}
