import { type CSSProperties, type ReactNode, type Ref } from 'react'

import { Slot } from '../Slot'

// ─── Types ────────────────────────────────────────────────────────────────────

type EasingValue =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | (string & {})

type PropertyValue =
  | 'all'
  | 'none'
  | 'opacity'
  | 'transform'
  | 'color'
  | 'background-color'
  | 'border-color'
  | 'box-shadow'
  | 'width'
  | 'height'
  | (string & {})

// ─── Props ────────────────────────────────────────────────────────────────────

interface TransitionProps {
  ref?: Ref<HTMLElement>
  /** Transition duration in ms, or a CSS time string e.g. `'200ms'` / `'0.2s'`. Defaults to `'200ms'`. */
  duration?: number | string
  /** CSS transition-timing-function. Defaults to `'ease-in-out'`. */
  easing?: EasingValue
  /** Transition delay in ms, or a CSS time string. */
  delay?: number | string
  /** CSS property or array of properties to transition. Defaults to `'all'`. */
  property?: PropertyValue | PropertyValue[]
  children?: ReactNode
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTimeString(value: number | string): string {
  if (typeof value === 'number') return `${value}ms`

  return value
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Transition({
  ref,
  duration = '200ms',
  easing = 'ease-in-out',
  delay,
  property = 'all',
  children,
  ...rest
}: TransitionProps) {
  const properties = Array.isArray(property) ? property.join(', ') : property

  const transitionStyle: CSSProperties = {
    transitionProperty: properties,
    transitionDuration: toTimeString(duration),
    transitionTimingFunction: easing,
    ...(delay !== undefined
      ? { transitionDelay: toTimeString(delay) }
      : undefined)
  }

  return (
    <Slot ref={ref} style={transitionStyle} {...rest}>
      {children}
    </Slot>
  )
}
