import { globalStyle } from '@vanilla-extract/css'

import { COLOR_PROP_DEFS, THEME_CONDITIONS } from './constants'

for (const { className, cssProperty, varPrefix } of Object.values(
  COLOR_PROP_DEFS
)) {
  for (const { suffix, varSuffix, selectorTemplate, media } of Object.values(
    THEME_CONDITIONS
  ) as Array<{
    suffix: string
    varSuffix: string
    selectorTemplate: string
    media?: string
  }>) {
    const fullClassName = `${className}${suffix}`

    const fullVar = `${varPrefix}${varSuffix}`

    const selector = selectorTemplate.replace('{cls}', fullClassName)

    if (media) {
      globalStyle(selector, {
        '@media': {
          [media]: {
            [cssProperty]: `var(${fullVar}) !important`
          }
        }
      })
    } else {
      globalStyle(selector, {
        [cssProperty]: `var(${fullVar})`
      })
    }
  }
}
