import type { ModuleCategory } from './interfaces/routes_interfaces'

const ROUTES: ModuleCategory[] = await Promise.all(
  Object.entries(
    Object.groupBy(
      Object.entries(import.meta.glob('../../apps/**/config.tsx')),
      ([key]) => key.split('/')[3]
    )
  )
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(async ([category, items]) => ({
      title: category.split('.').slice(1).join('.'),
      items: items
        ? await Promise.all(
            items
              .sort((a, b) =>
                a[0].split('/')[4].localeCompare(b[0].split('/')[4])
              )
              .map(
                async ([, resolver]) =>
                  ((await resolver()) as { default: any }).default
              )
          )
        : []
    }))
)

export default ROUTES
