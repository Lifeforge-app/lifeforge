export type ThemeConditionPropName =
  | 'base'
  | 'dark'
  | 'hover'
  | 'darkHover'
  | 'hasBgImage'
  | 'darkHasBgImage'
  | 'hasBgImageHover'
  | 'hasBgImageDarkHover'

export type ThemeConditionProp<T> =
  | T
  | Partial<Record<ThemeConditionPropName, T>>

export const THEME_CONDITIONS = {
  base: {
    suffix: '',
    varSuffix: '',
    selectorTemplate: '.{cls}'
  },
  dark: {
    suffix: '-dark',
    varSuffix: '-dark',
    selectorTemplate: '.dark .{cls}'
  },
  hover: {
    suffix: '-hover',
    varSuffix: '-hover',
    selectorTemplate: '.{cls}:hover'
  },
  darkHover: {
    suffix: '-dark-hover',
    varSuffix: '-dark-hover',
    selectorTemplate: '.dark .{cls}:hover'
  },
  hasBgImage: {
    suffix: '-has-bg-image',
    varSuffix: '-has-bg-image',
    selectorTemplate: '.has-bg-image .{cls}'
  },
  darkHasBgImage: {
    suffix: '-dark-has-bg-image',
    varSuffix: '-dark-has-bg-image',
    selectorTemplate: '.dark .has-bg-image .{cls}'
  },
  hasBgImageHover: {
    suffix: '-has-bg-image-hover',
    varSuffix: '-has-bg-image-hover',
    selectorTemplate: '.has-bg-image .{cls}:hover'
  },
  hasBgImageDarkHover: {
    suffix: '-has-bg-image-dark-hover',
    varSuffix: '-has-bg-image-dark-hover',
    selectorTemplate: '.dark .has-bg-image .{cls}:hover'
  }
} as const satisfies Record<
  ThemeConditionPropName,
  {
    suffix: string
    varSuffix: string
    selectorTemplate: string
  }
>
