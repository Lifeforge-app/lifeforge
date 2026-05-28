/**
 * Mixes a colour with transparency using `color-mix`.
 *
 * @param color  Any CSS color value (e.g. `bg[500]`, `'#hexValue'`, `'rgb(…)'`)
 * @param alpha  Opacity factor in [0, 1]
 * @returns      `color-mix(in srgb, <color> <alpha%>, transparent)`
 *
 * @example
 * borderColor: withOpacity(bg[500], 0.2)  // 20% opaque bg-500
 */
export function withOpacity(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))

  return `color-mix(in srgb, ${color} ${a * 100}%, transparent)`
}
