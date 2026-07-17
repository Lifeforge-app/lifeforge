import { COLORS } from './constants/colors'
import type { TokenizedColor } from './constants/colors'

const COLOR_WITH_OPACITY_BRAND = Symbol('ColorWithOpacity')

export type OpacityValue =
  '5%' | '10%' | '20%' | '30%' | '40%' | '50%' | '60%' | '70%' | '80%' | '90%'

export class ColorWithOpacity {
  readonly [COLOR_WITH_OPACITY_BRAND] = true
  readonly token: TokenizedColor
  readonly opacity: OpacityValue

  constructor(token: TokenizedColor, opacity: OpacityValue) {
    this.token = token
    this.opacity = opacity
  }

  toString(): string {
    return `color-mix(in srgb, ${COLORS[this.token]} ${this.opacity}, transparent)`
  }
}

export function colorWithOpacity(
  token: TokenizedColor,
  opacity: OpacityValue
): ColorWithOpacity {
  return new ColorWithOpacity(token, opacity)
}

export function isColorWithOpacity(value: unknown): value is ColorWithOpacity {
  return value instanceof ColorWithOpacity
}
