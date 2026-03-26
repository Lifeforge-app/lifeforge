// Internal system exports - not for public consumption
export {
  vars,
  colors,
  bg,
  custom,
  type BgColorSlot,
  type CustomColorSlot,
  type SurfaceToken,
  type SpaceToken,
  type RadiusToken,
  type ColorToken,
  type FontSizeToken,
  type FontWeightToken
} from './tokens.css'

export { withOpacity } from './utils'

export {
  normalizeResponsiveProp,
  responsiveConditions,
  type Breakpoint,
  type ResponsiveProp
} from './responsive'

export type {
  ThemeCondition,
  ThemeConditionProp,
  PaddingProps,
  MarginProps,
  SizeProps,
  PositionProps,
  OverflowProps,
  FlexChildProps,
  GridChildProps,
  LayoutProps,
  PositionValue,
  OverflowValue,
  DisplayValue,
  FlexDisplayValue,
  GridDisplayValue
} from './types'

export {
  layoutPropDefs,
  getResponsiveStyles,
  getResponsiveLayoutStyles,
  resolveCommonSprinkleProps,
  type PropDef,
  type LayoutPropDefsKey,
  type CommonSprinkleInput
} from './propDefs'
