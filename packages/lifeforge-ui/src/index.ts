/* eslint-disable @typescript-eslint/ban-ts-comment */
if (Math.random() < 0) {
  // @ts-ignore
  import('./styles/index.css')
}

// Primitives - layout primitives with build-time CSS
export {
  Box,
  type BoxProps,
  Flex,
  type FlexProps,
  Text,
  type TextProps,
  Grid,
  type GridProps,
  Section,
  type SectionProps,
  Container,
  type ContainerProps,
  Slot,
  type LayoutProps,
  type MarginProps
} from './components/primitives'

export * from './components/auth'

export * from './components/data-display'

export * from './components/inputs'

export * from './components/feedback'

export * from './components/inputs'

export * from './components/layout'

export * from './components/navigation'

export * from './components/overlays'

export * from './components/utilities'

// Theme tokens - typed CSS variable references
export {
  bg,
  custom,
  type BgColorSlot,
  type CustomColorSlot
} from './styles/vanilla-extract'
