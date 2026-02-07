import { globalStyle } from '@vanilla-extract/css'

// ============================================================================
// Responsive Layout Styles
// ============================================================================
// This generates static CSS that applies CSS custom properties at each breakpoint.
// The component sets the custom property value, the class applies it.
//
// Example:
// <Box width={{ base: "100px", md: "200px" }} />
// Generates: className="lf-w md:lf-w" style="--lf-w: 100px; --lf-w-md: 200px"
//
// CSS here applies:
// .lf-w { width: var(--lf-w); }
// @media (min-width: 768px) { .md\:lf-w { width: var(--lf-w-md); } }

// Define all responsive layout props
const responsiveProps = [
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
  { className: 'lf-fb', property: 'flexBasis', customProp: '--lf-fb' },
  { className: 'lf-fg', property: 'flexGrow', customProp: '--lf-fg' },
  { className: 'lf-fs', property: 'flexShrink', customProp: '--lf-fs' },
  { className: 'lf-ga', property: 'gridArea', customProp: '--lf-ga' },
  { className: 'lf-gc', property: 'gridColumn', customProp: '--lf-gc' },
  { className: 'lf-gcs', property: 'gridColumnStart', customProp: '--lf-gcs' },
  { className: 'lf-gce', property: 'gridColumnEnd', customProp: '--lf-gce' },
  { className: 'lf-gr', property: 'gridRow', customProp: '--lf-gr' },
  { className: 'lf-grs', property: 'gridRowStart', customProp: '--lf-grs' },
  { className: 'lf-gre', property: 'gridRowEnd', customProp: '--lf-gre' },
  {
    className: 'lf-gtc',
    property: 'gridTemplateColumns',
    customProp: '--lf-gtc'
  },
  { className: 'lf-gtr', property: 'gridTemplateRows', customProp: '--lf-gtr' }
] as const

// Breakpoint media queries
const breakpointMediaQueries = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)'
} as const

type BreakpointKey = keyof typeof breakpointMediaQueries

// CSS class name escaping for selectors starting with digits
// CSS spec requires escaping digits at start: 2xl -> \32 xl
function escapeCssClassName(name: string): string {
  if (/^\d/.test(name)) {
    return `\\3${name[0]} ${name.slice(1)}`
  }

  return name
}

// Generate base styles (no breakpoint = base/mobile)
for (const { className, property, customProp } of responsiveProps) {
  globalStyle(`.${className}`, {
    [property]: `var(${customProp})`
  })
}

// Generate breakpoint-specific styles
for (const { className, property, customProp } of responsiveProps) {
  for (const bp of Object.keys(breakpointMediaQueries) as BreakpointKey[]) {
    const escapedBp = escapeCssClassName(bp)

    const bpClassName = `${escapedBp}\\:${className}`

    const bpCustomProp = `${customProp}-${bp}`

    const mediaQuery = breakpointMediaQueries[bp]

    globalStyle(`.${bpClassName}`, {
      '@media': {
        [mediaQuery]: {
          [property]: `var(${bpCustomProp})`
        }
      }
    })
  }
}
