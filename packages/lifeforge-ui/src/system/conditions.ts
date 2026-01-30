/**
 * Tailwind CSS-compatible breakpoint conditions for vanilla-extract sprinkles.
 * Use this with `defineProperties` to create responsive sprinkles.
 *
 * @example
 * ```ts
 * const myProperties = defineProperties({
 *   conditions: responsiveConditions,
 *   defaultCondition: 'base',
 *   properties: {
 *     // your properties here
 *   }
 * })
 * ```
 */
export const responsiveConditions = {
  base: {},
  sm: { '@media': '(min-width: 640px)' },
  md: { '@media': '(min-width: 768px)' },
  lg: { '@media': '(min-width: 1024px)' },
  xl: { '@media': '(min-width: 1280px)' },
  '2xl': { '@media': '(min-width: 1536px)' }
} as const

/**
 * Default responsive condition (mobile-first)
 */
export const defaultCondition = 'base' as const
