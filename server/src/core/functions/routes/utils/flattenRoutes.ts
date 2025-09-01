import { ForgeControllerBuilder } from '../functions/forgeController'

export default function flattenRoutes(
  obj: Record<string, unknown>
): Record<string, ForgeControllerBuilder> {
  const result = {} as Record<string, ForgeControllerBuilder>

  function flatten(current: Record<string, unknown>, prefix = ''): void {
    for (const [key, value] of Object.entries(current)) {
      const newKey = prefix ? `${prefix}_${key}` : key

      if (!(value instanceof ForgeControllerBuilder)) {
        flatten(value as Record<string, unknown>, newKey)
      } else {
        result[newKey] = value as ForgeControllerBuilder
      }
    }
  }

  flatten(obj)

  return result
}
