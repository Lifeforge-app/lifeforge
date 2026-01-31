import type { Breakpoint, ResponsiveProp } from '../../system'

// ============================================================================
// Prop Definition Types
// ============================================================================

export interface PropDef {
  className: string
  customProperties: `--${string}`[]
  responsive: boolean
}

// ============================================================================
// Layout Prop Definitions
// ============================================================================

export const layoutPropDefs = {
  width: {
    className: 'lf-w',
    customProperties: ['--lf-w'],
    responsive: true
  },
  minWidth: {
    className: 'lf-min-w',
    customProperties: ['--lf-min-w'],
    responsive: true
  },
  maxWidth: {
    className: 'lf-max-w',
    customProperties: ['--lf-max-w'],
    responsive: true
  },
  height: {
    className: 'lf-h',
    customProperties: ['--lf-h'],
    responsive: true
  },
  minHeight: {
    className: 'lf-min-h',
    customProperties: ['--lf-min-h'],
    responsive: true
  },
  maxHeight: {
    className: 'lf-max-h',
    customProperties: ['--lf-max-h'],
    responsive: true
  },
  inset: {
    className: 'lf-inset',
    customProperties: ['--lf-inset'],
    responsive: true
  },
  top: {
    className: 'lf-t',
    customProperties: ['--lf-t'],
    responsive: true
  },
  right: {
    className: 'lf-r',
    customProperties: ['--lf-r'],
    responsive: true
  },
  bottom: {
    className: 'lf-b',
    customProperties: ['--lf-b'],
    responsive: true
  },
  left: {
    className: 'lf-l',
    customProperties: ['--lf-l'],
    responsive: true
  },
  flexBasis: {
    className: 'lf-fb',
    customProperties: ['--lf-fb'],
    responsive: true
  },
  flexGrow: {
    className: 'lf-fg',
    customProperties: ['--lf-fg'],
    responsive: true
  },
  flexShrink: {
    className: 'lf-fs',
    customProperties: ['--lf-fs'],
    responsive: true
  },
  gridArea: {
    className: 'lf-ga',
    customProperties: ['--lf-ga'],
    responsive: true
  },
  gridColumn: {
    className: 'lf-gc',
    customProperties: ['--lf-gc'],
    responsive: true
  },
  gridColumnStart: {
    className: 'lf-gcs',
    customProperties: ['--lf-gcs'],
    responsive: true
  },
  gridColumnEnd: {
    className: 'lf-gce',
    customProperties: ['--lf-gce'],
    responsive: true
  },
  gridRow: {
    className: 'lf-gr',
    customProperties: ['--lf-gr'],
    responsive: true
  },
  gridRowStart: {
    className: 'lf-grs',
    customProperties: ['--lf-grs'],
    responsive: true
  },
  gridRowEnd: {
    className: 'lf-gre',
    customProperties: ['--lf-gre'],
    responsive: true
  },
  // Grid container props
  columns: {
    className: 'lf-gtc',
    customProperties: ['--lf-gtc'],
    responsive: true
  },
  rows: {
    className: 'lf-gtr',
    customProperties: ['--lf-gtr'],
    responsive: true
  }
} as const satisfies Record<string, PropDef>

export type LayoutPropDefsKey = keyof typeof layoutPropDefs

// ============================================================================
// Responsive Style Generator
// ============================================================================

function isResponsiveObject<T>(
  value: ResponsiveProp<T>
): value is Exclude<ResponsiveProp<T>, T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

interface ResponsiveStyleResult {
  className: string
  style: Record<string, string>
}

/**
 * Generates breakpoint-specific classes and CSS custom properties for arbitrary values.
 *
 * @example
 * getResponsiveStyles(layoutPropDefs.width, "100px")
 * // => { className: "lf-w", style: { "--lf-w": "100px" } }
 *
 * getResponsiveStyles(layoutPropDefs.width, { base: "100px", md: "200px" })
 * // => { className: "lf-w md:lf-w", style: { "--lf-w": "100px", "--lf-w-md": "200px" } }
 */
export function getResponsiveStyles(
  propDef: PropDef,
  value: ResponsiveProp<string> | undefined
): ResponsiveStyleResult | undefined {
  if (value === undefined) return undefined

  const classNames: string[] = []

  const style: Record<string, string> = {}

  const baseProp = propDef.customProperties[0]

  if (typeof value === 'string') {
    classNames.push(propDef.className)
    style[baseProp] = value
  } else if (isResponsiveObject(value)) {
    for (const [bp, val] of Object.entries(value) as [
      Breakpoint,
      string | undefined
    ][]) {
      if (val === undefined) continue

      const bpClass =
        bp === 'base' ? propDef.className : `${bp}:${propDef.className}`

      const bpVar = bp === 'base' ? baseProp : `${baseProp}-${bp}`

      classNames.push(bpClass)
      style[bpVar] = val
    }
  }

  if (classNames.length === 0) return undefined

  return {
    className: classNames.join(' '),
    style
  }
}

/**
 * Generates responsive styles for multiple props at once.
 */
export function getResponsiveLayoutStyles(
  props: Partial<Record<LayoutPropDefsKey, ResponsiveProp<string>>>
): ResponsiveStyleResult {
  const classNames: string[] = []

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(props)) {
    const propDef = layoutPropDefs[key as LayoutPropDefsKey]

    if (!propDef || value === undefined) continue

    const result = getResponsiveStyles(propDef, value)

    if (result) {
      classNames.push(result.className)
      Object.assign(style, result.style)
    }
  }

  return {
    className: classNames.join(' '),
    style
  }
}
