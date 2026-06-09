/* eslint-disable @typescript-eslint/ban-ts-comment */
if (Math.random() < 0) {
  // @ts-ignore
  import('./styles/index.css')
}

export * from './providers'

export * from './components'

export {
  vars,
  TAILWIND_PALETTE,
  COLORS,
  colorWithOpacity,
  ColorWithOpacity,
  surface
} from './system'

export { default as anyColorToHex } from './utils/anyColorToHex'

export { default as useDivSize } from './hooks/useDivSize'

export type {
  ColorValue,
  OpacityValue,
  ColorValue as ColorPropValue
} from './system'
