import type { ColorValue } from './colors'
import type { ThemeConditionProp } from './theme-conditions'

export type ColorPropName =
  | 'bg'
  | 'color'
  | 'borderColor'
  | 'ringColor'
  | 'ringOffsetColor'
  | 'divideColor'

export type ColorProps = Partial<
  Record<ColorPropName, ThemeConditionProp<ColorValue>>
>

export const COLOR_PROP_DEFS = {
  bg: {
    className: 'lf-bg',
    cssProperty: 'backgroundColor',
    varPrefix: '--lf-bg'
  },
  color: {
    className: 'lf-color',
    cssProperty: 'color',
    varPrefix: '--lf-color'
  },
  borderColor: {
    className: 'lf-border-color',
    cssProperty: 'borderColor',
    varPrefix: '--lf-border-color'
  },
  ringColor: {
    className: 'lf-ring-color',
    cssProperty: '--lf-ring-color',
    varPrefix: '--lf-ring-color'
  },
  ringOffsetColor: {
    className: 'lf-ring-offset-color',
    cssProperty: '--lf-ring-offset-color',
    varPrefix: '--lf-ring-offset-color'
  },
  divideColor: {
    className: 'lf-divide-color',
    cssProperty: '--lf-divide-color',
    varPrefix: '--lf-divide-color'
  }
} as const satisfies Record<
  ColorPropName,
  {
    className: string
    cssProperty: string
    varPrefix: string
  }
>
