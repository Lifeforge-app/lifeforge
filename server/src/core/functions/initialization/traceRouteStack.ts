import z from 'zod'

type Route = {
  method: string
  path: string
  description: string
  schema: {
    response: unknown
    params?: unknown
    body?: unknown
    query?: unknown
  }
}

export default function traceRouteStack(
  stack: any,
  path = '',
  routes: Route[] = []
) {
  for (const layer of stack) {
    if (layer.handle?.stack && Array.isArray(layer.handle.stack)) {
      const pathName =
        layer.regexp
          .toString()
          .match(/\/\^\\\/(.*)\\\/\?\(\?=\\\/\|\$\)\/i/)?.[1]
          ?.replace(/\\\//g, '/') ?? ''

      const fullPath = [path, pathName].filter(Boolean).join('/')

      traceRouteStack(layer.handle.stack, fullPath, routes)
    }

    // Check for route dispatch by looking for .route property
    if (layer.route) {
      const method = layer.route.methods || {}

      const methods = Object.keys(method).filter(m => method[m])

      const routePath = [path, layer.route.path || '']
        .filter(Boolean)
        .join('/')
        .replace(/\/+/g, '/')
        .replace(/\\\//g, '/')

      let route: Route = {
        method: methods[0]?.toUpperCase() || 'GET',
        path: routePath,
        schema: {
          response: z.void()
        },
        description: ''
      }

      routes.push(route)

      const routeStack = layer.route.stack || []

      const controllerLayerMeta =
        routeStack[routeStack.length - 1]?.handle?.meta

      if (!controllerLayerMeta) {
        continue
      }

      route.description = controllerLayerMeta.description
      route = controllerLayerMeta
    }
  }

  return routes.filter(route => route.path !== '*')
}
