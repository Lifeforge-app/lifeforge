// helper functions used by vanilla-extract styles

/**
 * Apply an opacity value to a CSS color string.
 *
 * This leverages the modern CSS color syntax which allows
 * `color / alpha` when the color is a custom property (via var()).
 *
 * Example:
 *   withOpacity('var(--color-bg-700)', 0.5) // 'var(--color-bg-700) / 0.5'
 */
export function withOpacity(color: string, alpha: number): string {
  // clamp alpha between 0 and 1
  const a = Math.max(0, Math.min(1, alpha))

  return `${color} / ${a}`
}
