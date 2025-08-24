import {
  CollectionKey,
  ExpandConfig,
  FilterType
} from '../typescript/pb_service'

/**
 * Recursively builds filter expressions and parameters for PocketBase queries
 * @template TCollectionKey - The collection key type
 * @template TExpandConfig - The expand configuration type
 * @param filter - The filter configuration object
 * @param paramCounter - Counter for generating unique parameter names
 * @param params - Accumulated parameters object
 * @returns Object containing the filter expression string and parameters
 */
export function recursivelyBuildFilter<
  TCollectionKey extends CollectionKey,
  TExpandConfig extends ExpandConfig<TCollectionKey>
>(
  filter: FilterType<TCollectionKey, TExpandConfig>,
  paramCounter: { count: number } = { count: 0 },
  params: Record<string, unknown> = {}
): { expression: string; params: Record<string, unknown> } {
  const expressions = filter
    .filter(Boolean)
    .map(f => {
      if ('combination' in f!) {
        const subFilters = f.filters
          .filter(Boolean)
          .map(subFilter => {
            if ('combination' in subFilter!) {
              const result = recursivelyBuildFilter(
                [subFilter],
                paramCounter,
                params
              )

              return `(${result.expression})`
            }

            const paramName = `param${paramCounter.count++}`

            params[paramName] = subFilter!.value

            return `${String(subFilter!.field)}${subFilter!.operator}{:${paramName}}`
          })
          .filter(Boolean)

        return subFilters.length
          ? `(${subFilters.join(` ${f.combination} `)})`
          : ''
      }

      const paramName = `param${paramCounter.count++}`

      params[paramName] = f!.value

      return `${String(f!.field)}${f!.operator}{:${paramName}}`
    })
    .filter(Boolean)

  return {
    expression: expressions.join(' && '),
    params
  }
}
