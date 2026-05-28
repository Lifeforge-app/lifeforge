import type { ResponsiveProp } from '..'
import type { Breakpoint } from '../types'

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
export function normalizeResponsiveProp<TInput, TOutput = TInput>(
  prop: ResponsiveProp<TInput, any, 'input'> | undefined,
  mapper?: (value: TInput) => TOutput
): ResponsiveProp<TInput, TOutput, 'output'> | undefined {
  if (prop == undefined) {
    return undefined
  }

  if (typeof prop === 'object') {
    const result: {
      [K in Breakpoint]?: TOutput
    } = {}

    for (const [key, value] of Object.entries(prop) as [Breakpoint, TInput][]) {
      if (value !== undefined) {
        result[key] = mapper ? mapper(value) : (value as unknown as TOutput)
      }
    }

    return result
  }

  return mapper ? mapper(prop) : prop
}
