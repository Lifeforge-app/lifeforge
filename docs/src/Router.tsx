import _ from 'lodash'
import { RouteObject } from 'react-router'

import { components as COMPONENTS } from './components/MdxComponents'

const modules = import.meta.glob(['./contents/**/*.mdx'])

const sectionItems = Object.groupBy(Object.keys(modules), item =>
  _.kebabCase(item.split('/')[2].replace(/^\d{2}\./, ''))
)

const ROUTES: RouteObject[] = []

const routePromises = Object.entries(sectionItems).map(
  async ([title, items]) => {
    if (!items) return {}

    const importPromises = items.map(async path => {
      const importer = modules[path]

      if (!importer) throw new Error(`Module not found: ${path}`)

      const mod = (await importer()) as { default: any }

      return [
        _.kebabCase(
          path
            .split('/')
            .pop()!
            .replace(/^\d{2}\./, '')
            .split('.')[0]
        ),
        mod.default
      ] as const
    })

    const awaitedRoutes = await Promise.all(importPromises)

    return {
      path: `/${title}`,
      children: awaitedRoutes.map(([path, Element]) => ({
        path,
        element: <Element components={COMPONENTS} />
      }))
    } satisfies RouteObject
  }
)

await Promise.all(routePromises).then(resolvedRoutes => {
  ROUTES.push(...resolvedRoutes)
})

export default ROUTES
