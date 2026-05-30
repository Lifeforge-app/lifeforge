import { globalStyle } from '@vanilla-extract/css'

import { COLOR_PROP_DEFS, THEME_CONDITIONS } from './constants'

for (const { className, cssProperty, varPrefix } of Object.values(
  COLOR_PROP_DEFS
)) {
  for (const { suffix, varSuffix, selectorTemplate } of Object.values(
    THEME_CONDITIONS
  )) {
    const fullClassName = `${className}${suffix}`

    const fullVar = `${varPrefix}${varSuffix}`

    const selector = selectorTemplate.replace('{cls}', fullClassName)

    globalStyle(selector, {
      [cssProperty]: `var(${fullVar})`
    })
  }
}
