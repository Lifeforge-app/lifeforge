import { Forge } from '@lifeforge/server-utils'

export default function flattenRoutes(
  obj: Record<string, unknown>
): Record<string, Forge<any>> {
  const result = {} as Record<string, Forge<any>>

  function flatten(current: Record<string, unknown>, prefix = ''): void {
    for (const [key, value] of Object.entries(current)) {
      const newKey = prefix ? `${prefix}_${key}` : key

      if (!(value instanceof Forge)) {
        flatten(value as Record<string, unknown>, newKey)
      } else {
        result[newKey] = value as Forge<any>
      }
    }
  }

  flatten(obj)

  return result
}
