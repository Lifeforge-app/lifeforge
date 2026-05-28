import { type CSSProperties, type ReactNode, type Ref } from 'react'

import { bg, withOpacity } from '@/system'

import { Slot } from '../Slot'
import { divideBase } from './WithDivide.css'

// ─── Props ────────────────────────────────────────────────────────────────────

interface WithDivideProps {
  ref?: Ref<HTMLElement>
  /**
   * Border color applied between children in light mode.
   * Accepts any CSS color value, e.g. `bg[200]`, `'#hexValue'`, `withOpacity(bg[500], 0.3)`.
   * Defaults to `bg[200]`.
   */
  color?: string
  /**
   * Border color applied between children in dark mode.
   * Defaults to `withOpacity(bg[700], 0.5)`.
   */
  darkColor?: string
  children?: ReactNode
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Merges a top-border divider style onto its single child via slot.
 * The border is applied to every child that is not the first sibling,
 * matching the CSS `:not(:first-child)` selector.
 *
 * Wrap each repeating item with `<WithDivide>` inside a list and the borders
 * will appear automatically between items without any extra markup.
 *
 * @example
 * ```tsx
 * {items.map(item => (
 *   <WithDivide key={item.id}>
 *     <div>{item.label}</div>
 *   </WithDivide>
 * ))}
 * ```
 */
export function WithDivide({
  ref,
  color = bg[200],
  darkColor = withOpacity(bg[700], 0.5),
  children
}: WithDivideProps) {
  return (
    <Slot
      ref={ref}
      className={divideBase}
      style={
        {
          '--divide-color': color,
          '--divide-dark-color': darkColor
        } as CSSProperties
      }
    >
      {children}
    </Slot>
  )
}
