import { globalStyle } from '@vanilla-extract/css'

import { escapeCssClassName } from './utils/escapeCssClassName'

const RESPONSIVE_PROPS = [
  { className: 'lf-w', property: 'width', customProp: '--lf-w' },
  { className: 'lf-min-w', property: 'minWidth', customProp: '--lf-min-w' },
  { className: 'lf-max-w', property: 'maxWidth', customProp: '--lf-max-w' },
  { className: 'lf-h', property: 'height', customProp: '--lf-h' },
  { className: 'lf-min-h', property: 'minHeight', customProp: '--lf-min-h' },
  { className: 'lf-max-h', property: 'maxHeight', customProp: '--lf-max-h' },
  { className: 'lf-inset', property: 'inset', customProp: '--lf-inset' },
  { className: 'lf-t', property: 'top', customProp: '--lf-t' },
  { className: 'lf-r', property: 'right', customProp: '--lf-r' },
  { className: 'lf-b', property: 'bottom', customProp: '--lf-b' },
  { className: 'lf-l', property: 'left', customProp: '--lf-l' },
  { className: 'lf-fl', property: 'flex', customProp: '--lf-fl' },
  { className: 'lf-fb', property: 'flexBasis', customProp: '--lf-fb' },
  { className: 'lf-fg', property: 'flexGrow', customProp: '--lf-fg' },
  { className: 'lf-fs', property: 'flexShrink', customProp: '--lf-fs' },
  { className: 'lf-ga', property: 'gridArea', customProp: '--lf-ga' },
  { className: 'lf-gcsp', property: 'gridColumn', customProp: '--lf-gcsp' },
  { className: 'lf-grsp', property: 'gridRow', customProp: '--lf-grsp' },
  {
    className: 'lf-gtc',
    property: 'gridTemplateColumns',
    customProp: '--lf-gtc'
  },
  { className: 'lf-gtr', property: 'gridTemplateRows', customProp: '--lf-gtr' },
  { className: 'lf-zi', property: 'zIndex', customProp: '--lf-zi' },
  { className: 'lf-rw', property: '--lf-ring-width', customProp: '--lf-rw' },
  {
    className: 'lf-row',
    property: '--lf-ring-offset-width',
    customProp: '--lf-row'
  },
  { className: 'lf-size', property: 'width', customProp: '--lf-size' },
  { className: 'lf-size', property: 'height', customProp: '--lf-size' },
  { className: 'lf-ar', property: 'aspectRatio', customProp: '--lf-ar' }
] as const

// Breakpoint media queries
const breakpointMediaQueries = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  print: 'print'
} as const

// Generate base styles (no breakpoint = base/mobile)
for (const { className, property, customProp } of RESPONSIVE_PROPS) {
  globalStyle(`.${className}`, {
    [property]: `var(${customProp})`
  })
}

// Generate breakpoint-specific styles
for (const { className, property, customProp } of RESPONSIVE_PROPS) {
  for (const bp of Object.keys(
    breakpointMediaQueries
  ) as (keyof typeof breakpointMediaQueries)[]) {
    const escapedBp = escapeCssClassName(bp)

    const bpClassName = `${escapedBp}\\:${className}`

    const bpCustomProp = `${customProp}-${bp}`

    const mediaQuery = breakpointMediaQueries[bp]

    globalStyle(`.${bpClassName}`, {
      '@media': {
        [mediaQuery]: {
          [property]: bp === 'print' ? `var(${bpCustomProp}) !important` : `var(${bpCustomProp})`
        }
      }
    })
  }
}
