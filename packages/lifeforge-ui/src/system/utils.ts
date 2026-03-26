/**
 * Apply an opacity value to a CSS color string.
 *
 * Uses color-mix() to blend the color with transparent, which works
 * correctly with CSS custom properties (var()).
 *
 * @example
 *   withOpacity(bg[700], 0.5) // 'color-mix(in srgb, var(--color-bg-700) 50%, transparent)'
 *   withOpacity(custom[500], 0.1)
 */
export function withOpacity(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))

  return `color-mix(in srgb, ${color} ${a * 100}%, transparent)`
}
