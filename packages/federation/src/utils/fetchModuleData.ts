import { type InferOutput } from '@lifeforge/api'
import { contract, createForgeProxy } from '@lifeforge/api'

const forgeAPI = createForgeProxy(contract)

export type CategoryOrder = Record<string, Record<string, string>>

export type FederatedModule = InferOutput<
  typeof forgeAPI.modules.manifest
>['modules'][number]

export async function fetchCategoryOrder(
  apiHost: string
): Promise<CategoryOrder> {
  try {
    return (
      (await forgeAPI.modules.categories.list.setHost(apiHost).query()) ?? {}
    )
  } catch (e) {
    console.warn('Failed to fetch category order:', e)

    return {}
  }
}

export async function fetchModuleManifest(
  apiHost: string
): Promise<FederatedModule[]> {
  try {
    const { modules } = await forgeAPI.modules.manifest.setHost(apiHost).query()

    return modules ?? []
  } catch (e) {
    console.warn('Failed to fetch module manifest:', e)

    return []
  }
}
