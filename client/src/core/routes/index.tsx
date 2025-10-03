import type {
  ModuleCategory,
  ModuleConfig
} from './interfaces/routes_interfaces'

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

const externalModules = import.meta.glob('../../../../apps/**/config.tsx')

await Promise.all(
  Object.entries(externalModules).map(async ([_, resolver]) => {
    const mod = (await resolver()) as {
      default: ModuleConfig & { category?: string }
    }

    const category = mod.default.category || '98.Miscellaneous'

    const categoryIndex = ROUTES.findIndex(
      cat => cat.title === category.split('.').slice(1).join('.')
    )

    if (categoryIndex > -1) {
      ROUTES[categoryIndex].items.push(mod.default)
    } else {
      ROUTES.push({
        title: category.split('.').slice(1).join('.'),
        items: [mod.default]
      })
    }
  })
)

export default ROUTES
