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

interface TransitionEntry {
  property: PropertyValue
  /** Overrides the component-level duration for this property. */
  duration?: number | string
  /** Overrides the component-level easing for this property. */
  easing?: EasingValue
  /** Overrides the component-level delay for this property. */
  delay?: number | string
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TransitionProps {
  ref?: Ref<HTMLElement>
  /** Transition duration in ms, or a CSS time string e.g. `'200ms'` / `'0.2s'`. Defaults to `'200ms'`. */
  duration?: number | string
  /** CSS transition-timing-function. Defaults to `'ease-in-out'`. */
  easing?: EasingValue
  /** Transition delay in ms, or a CSS time string. */
  delay?: number | string
  /**
   * Property or array of properties to transition. Each entry can be a plain
   * property name (uses component-level duration/easing/delay) or a
   * `TransitionEntry` object with per-property overrides.
   */
  property?:
    | PropertyValue
    | TransitionEntry
    | Array<PropertyValue | TransitionEntry>
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTimeString(value: number | string): string {
  if (typeof value === 'number') return `${value}ms`

  return value
}

export function buildEntry(
  entry: PropertyValue | TransitionEntry,
  defaults: { duration: string; easing: string; delay?: string }
): string {
  if (typeof entry === 'string') {
    const parts = [entry, defaults.duration, defaults.easing]

    if (defaults.delay) parts.push(defaults.delay)

    return parts.join(' ')
  }

  const duration = toTimeString(entry.duration ?? defaults.duration)

  const easing = entry.easing ?? defaults.easing

  const delay =
    entry.delay !== undefined ? toTimeString(entry.delay) : defaults.delay

  const parts = [entry.property, duration, easing]

  if (delay) parts.push(delay)

  return parts.join(' ')
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A component that applies CSS transitions to its children. You can specify the transition properties, duration, easing, and delay. This component generates the appropriate CSS `transition` property based on the provided props and applies it to a wrapper element around the children.
 *
 * Defaults:
 * - `duration`: `'200ms'`
 * - `easing`: `'ease-in-out'`
 * - `property`: `'all'`
 */
export function Transition({
  ref,
  duration = '200ms',
  easing = 'ease-in-out',
  delay,
  property = 'all',
  children,
  className,
  style
}: TransitionProps) {
  const defaults = {
    duration: toTimeString(duration),
    easing,
    delay: delay !== undefined ? toTimeString(delay) : undefined
  }

  const entries = Array.isArray(property) ? property : [property]

  const transition = entries.map(e => buildEntry(e, defaults)).join(', ')

  return (
    <Slot ref={ref} className={className} style={{ transition, ...style }}>
      {children}
    </Slot>
  )
}
