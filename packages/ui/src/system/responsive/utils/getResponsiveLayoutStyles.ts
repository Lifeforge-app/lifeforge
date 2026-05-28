import type { ResponsiveProp } from '@/system'

import { LAYOUT_PROP_DEFS, type LayoutPropDefsKey } from '../constant'
import type { Breakpoint, PropDef } from '../types'

interface ResponsiveStyleResult {
  className: string
  style: Record<string, string>
}

function isResponsiveObject<T>(
  value: ResponsiveProp<T>
): value is Exclude<ResponsiveProp<T>, T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getResponsiveStyles(
  propDef: PropDef,
  value: ResponsiveProp<string | number> | undefined
): ResponsiveStyleResult | undefined {
  if (value === undefined) return undefined

  const classNames: string[] = []

  const style: Record<string, string> = {}

  const baseProp = propDef.customProperties[0]

  if (typeof value === 'string' || typeof value === 'number') {
    classNames.push(propDef.className)
    style[baseProp] = value.toString()
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

export function getResponsiveLayoutStyles(
  props: Partial<Record<LayoutPropDefsKey, ResponsiveProp<string | number>>>
): ResponsiveStyleResult {
  const classNames: string[] = []

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(props)) {
    const propDef = LAYOUT_PROP_DEFS[key as LayoutPropDefsKey]

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
