/** The condition keys used in sprinkles for theme-adaptive props. */
export type ThemeCondition = 'base' | 'dark' | 'hover' | 'darkHover'

/**
 * A prop that accepts either a plain value or a map of per-condition values.
 * Mirrors the vanilla-extract sprinkles condition syntax.
 *
 * @example
 * bg={{ base: 'bg-50', dark: 'bg-900' }}
 */
export type ThemeConditionProp<T> = T | Partial<Record<ThemeCondition, T>>
