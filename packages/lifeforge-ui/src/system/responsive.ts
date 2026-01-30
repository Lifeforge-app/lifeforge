/**
 * Breakpoint keys matching Tailwind CSS breakpoints
 */
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * Responsive prop type - allows a single value or an object with breakpoint keys
 */
export type ResponsiveProp<T> = T | { [K in Breakpoint]?: T }

/**
 * Normalizes a responsive prop to the sprinkles format.
 * Handles both single values and responsive objects with breakpoint keys.
 *
 * @param prop - The prop value (single or responsive object)
 * @param mapper - Optional function to transform values
 * @returns Normalized value compatible with sprinkles
 *
 * @example
 * // Single value
 * normalizeResponsiveProp('sm') // => 'sm'
 *
 * // Responsive object
 * normalizeResponsiveProp({ base: 'sm', lg: 'md' }) // => { base: 'sm', lg: 'md' }
 *
 * // With mapper
 * normalizeResponsiveProp('start', v => alignMap[v]) // => 'flex-start'
 */
export function normalizeResponsiveProp<T, R>(
  prop: ResponsiveProp<T> | undefined,
  mapper?: (value: T) => R
): { [K in Breakpoint]?: R } | R | undefined {
  if (prop === undefined) {
    return undefined
  }

  if (typeof prop === 'object' && prop !== null) {
    const result: { [K in Breakpoint]?: R } = {}

    for (const [key, value] of Object.entries(prop) as [Breakpoint, T][]) {
      if (value !== undefined) {
        result[key] = mapper ? mapper(value) : (value as unknown as R)
      }
    }

    return result
  }

  return mapper ? mapper(prop) : (prop as unknown as R)
}
