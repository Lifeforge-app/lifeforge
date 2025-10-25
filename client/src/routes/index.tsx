import type { ModuleCategory, ModuleConfig } from 'shared'

let ROUTES: ModuleCategory[] = await Promise.all(
  Object.entries(
    Object.groupBy(
      Object.entries(import.meta.glob('../apps/**/config.tsx')),
      ([key]) => key.split('/')[2]
    )
  )
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(async ([category, items]) => ({
      title: category.split('.').slice(1).join('.'),
      items: items
        ? await Promise.all(
            items
              .sort((a, b) =>
                a[0].split('/')[3].localeCompare(b[0].split('/')[3])
              )
              .map(
                async ([, resolver]) =>
                  ((await resolver()) as { default: any }).default
              )
          )
        : []
    }))
)

const externalModules = import.meta.glob('../../../apps/**/manifest.ts')

await Promise.all(
  Object.entries(externalModules).map(async ([_, resolver]) => {
    const mod = (await resolver()) as {
      default: ModuleConfig & { category?: string }
    }

    const category = mod.default.category || 'Miscellaneous'

    const categoryIndex = ROUTES.findIndex(cat => cat.title === category)

    if (categoryIndex > -1) {
      ROUTES[categoryIndex].items.push(mod.default)
    } else {
      ROUTES.push({
        title: category,
        items: [mod.default]
      })
    }
  })
)

ROUTES = ROUTES.sort((a, b) => a.title.localeCompare(b.title)).map(cat => ({
  title: cat.title,
  items: cat.items.sort((a, b) => a.name.localeCompare(b.name))
}))

import.meta.glob('../../../apps/**/client/src/index.css', {
  eager: true
})

export default ROUTES
