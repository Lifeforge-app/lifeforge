import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../../../system'
import { Slot } from '../Slot'
import type { MarginProps } from '../types'
import { type TextSprinkles, textBase, textSprinkles } from './text.css'

type TextSize =
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'

type TextColor =
  | 'default'
  | 'muted'
  | 'primary'
  | 'inherit'
  | 'bg-50'
  | 'bg-100'
  | 'bg-200'
  | 'bg-300'
  | 'bg-400'
  | 'bg-500'
  | 'bg-600'
  | 'bg-700'
  | 'bg-800'
  | 'bg-900'
  | 'bg-950'
  | 'custom-50'
  | 'custom-100'
  | 'custom-200'
  | 'custom-300'
  | 'custom-400'
  | 'custom-500'
  | 'custom-600'
  | 'custom-700'
  | 'custom-800'
  | 'custom-900'

type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold'

type TextAlign = 'left' | 'center' | 'right'

type TextDecoration = 'underline' | 'line-through' | 'none'

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none'

type TextWrap = 'wrap' | 'nowrap' | 'pretty' | 'balance'

type TextTrim = 'normal' | 'start' | 'end' | 'both'

const DEFAULT_ELEMENT = 'span' as const

interface TextOwnProps<
  T extends ElementType = typeof DEFAULT_ELEMENT
> extends MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  size?: ResponsiveProp<TextSize>
  color?: ResponsiveProp<TextColor>
  weight?: ResponsiveProp<FontWeight>
  align?: ResponsiveProp<TextAlign>
  decoration?: ResponsiveProp<TextDecoration>
  transform?: ResponsiveProp<TextTransform>
  wrap?: ResponsiveProp<TextWrap>
  trim?: ResponsiveProp<TextTrim>
  truncate?: boolean
  lineClamp?: number
  className?: string
  children?: ReactNode
}

export type TextProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  TextOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof TextOwnProps<T>>

// Trim support - using CSS text-box-trim (experimental, use className for fallback)
const trimClassMap: Record<TextTrim, string> = {
  normal: '',
  start: 'trim-start',
  end: 'trim-end',
  both: 'trim-both'
}

export function Text<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  size,
  color,
  weight,
  align,
  decoration,
  transform,
  wrap,
  trim,
  truncate,
  lineClamp,
  // Margin props
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  className,
  style,
  children,
  ...rest
}: TextProps<T> & { style?: CSSProperties }) {
  const sprinklesClassName = textSprinkles({
    fontSize: normalizeResponsiveProp(size) as TextSprinkles['fontSize'],
    lineHeight: normalizeResponsiveProp(size) as TextSprinkles['lineHeight'],
    color: normalizeResponsiveProp(color) as TextSprinkles['color'],
    fontWeight: normalizeResponsiveProp(weight) as TextSprinkles['fontWeight'],
    textAlign: normalizeResponsiveProp(align) as TextSprinkles['textAlign'],
    textDecoration: normalizeResponsiveProp(
      decoration
    ) as TextSprinkles['textDecoration'],
    textTransform: normalizeResponsiveProp(
      transform
    ) as TextSprinkles['textTransform'],
    textWrap: normalizeResponsiveProp(wrap) as TextSprinkles['textWrap'],
    margin: normalizeResponsiveProp(m) as TextSprinkles['margin'],
    marginTop: normalizeResponsiveProp(mt ?? my) as TextSprinkles['marginTop'],
    marginBottom: normalizeResponsiveProp(
      mb ?? my
    ) as TextSprinkles['marginBottom'],
    marginLeft: normalizeResponsiveProp(
      ml ?? mx
    ) as TextSprinkles['marginLeft'],
    marginRight: normalizeResponsiveProp(
      mr ?? mx
    ) as TextSprinkles['marginRight']
  })

  const truncateStyle: CSSProperties | undefined = truncate
    ? {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    : undefined

  const lineClampStyle: CSSProperties | undefined = lineClamp
    ? {
        display: '-webkit-box',
        WebkitLineClamp: lineClamp,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    : undefined

  // Trim class
  const trimValue = typeof trim === 'object' ? trim.base : trim

  const trimClass = trimValue ? trimClassMap[trimValue] : ''

  const mergedStyle =
    truncateStyle || lineClampStyle
      ? { ...style, ...truncateStyle, ...lineClampStyle }
      : style

  const Component = asChild ? Slot : (as ?? DEFAULT_ELEMENT)

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(textBase(), sprinklesClassName, trimClass, className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}
