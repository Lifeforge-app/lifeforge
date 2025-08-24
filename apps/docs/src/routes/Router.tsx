import _ from 'lodash'
import { RouteObject } from 'react-router'

import { components as COMPONENTS } from '../components/MdxComponents'
import SectionItems from './Sections'

const modules = import.meta.glob(['../contents/**/*.mdx'])

const ROUTES: any[] = []

const routePromises = Object.entries(SectionItems).map(
  async ([title, items]) => {
    const importPromises = items.map(async item => {
      const path = `../contents/${_.kebabCase(title)}/${_.upperFirst(_.camelCase(item))}.mdx`

      const importer = modules[path]

      if (!importer) throw new Error(`Module not found: ${path}`)

      const mod = (await importer()) as { default: any }

      return [_.kebabCase(item), mod.default] as const
    })

    const awaitedRoutes = await Promise.all(importPromises)

    return {
      path: `/${_.kebabCase(title)}`,
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
