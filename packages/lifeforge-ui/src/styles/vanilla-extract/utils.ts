// helper functions used by vanilla-extract styles

/**
 * Apply an opacity value to a CSS color string.
 *
 * Uses color-mix() to blend the color with transparent, which works
 * correctly with CSS custom properties (var()).
 *
 * Example:
 *   withOpacity('var(--color-bg-700)', 0.5) // 'color-mix(in srgb, var(--color-bg-700) 50%, transparent)'
 */
export function withOpacity(color: string, alpha: number): string {
  // clamp alpha between 0 and 1
  const a = Math.max(0, Math.min(1, alpha))

  return `color-mix(in srgb, ${color} ${a * 100}%, transparent)`
}
