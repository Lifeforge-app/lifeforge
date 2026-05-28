import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import {
  type MarginProps,
  type PaddingProps,
  type ResponsiveProp,
  type ThemeConditionProp,
  normalizeResponsiveProp
} from '@/system'

import { Slot } from '../Slot'
import {
  type TextColorValues,
  type TextSprinkles,
  textBase,
  textSprinkles
} from './Text.css'

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

type TextTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'

type TextLeading = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold'

type TextAlign = 'left' | 'center' | 'right'

type TextDecoration = 'underline' | 'line-through' | 'none'

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none'

type TextWrap = 'wrap' | 'nowrap' | 'pretty' | 'balance'

type TextWhiteSpace =
  | 'normal'
  | 'nowrap'
  | 'pre'
  | 'pre-line'
  | 'pre-wrap'
  | 'break-spaces'

type TextWordBreak = 'normal' | 'break-all' | 'keep-all'

type TextOverflowWrap = 'normal' | 'break-word' | 'anywhere'

type TextTrim = 'normal' | 'start' | 'end' | 'both'

interface TextOwnProps<T extends ElementType = 'span'>
  extends MarginProps, PaddingProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  size?: ResponsiveProp<TextSize>
  color?: ThemeConditionProp<TextColorValues>
  bg?: ThemeConditionProp<TextColorValues>
  weight?: ResponsiveProp<FontWeight>
  align?: ResponsiveProp<TextAlign>
  decoration?: ResponsiveProp<TextDecoration>
  transform?: ResponsiveProp<TextTransform>
  wrap?: ResponsiveProp<TextWrap>
  whiteSpace?: ResponsiveProp<TextWhiteSpace>
  wordBreak?: ResponsiveProp<TextWordBreak>
  overflowWrap?: ResponsiveProp<TextOverflowWrap>
  display?: ResponsiveProp<
    | 'block'
    | 'inline'
    | 'inline-block'
    | 'flex'
    | 'inline-flex'
    | 'none'
    | 'contents'
  >
  trim?: ResponsiveProp<TextTrim>
  truncate?: boolean
  lineClamp?: number
  tracking?: ResponsiveProp<TextTracking>
  leading?: ResponsiveProp<TextLeading>
  className?: string
  children?: ReactNode
}

export type TextProps<T extends ElementType = 'span'> = TextOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof TextOwnProps<T>>

// Trim support - using CSS text-box-trim (experimental, use className for fallback)
const trimClassMap: Record<TextTrim, string> = {
  normal: '',
  start: 'trim-start',
  end: 'trim-end',
  both: 'trim-both'
}

export function Text<T extends ElementType = 'span'>({
  as,
  asChild = false,
  ref,
  size,
  color,
  bg,
  weight,
  align,
  display,
  decoration,
  transform,
  wrap,
  whiteSpace,
  wordBreak,
  overflowWrap,
  trim,
  truncate,
  lineClamp,
  tracking,
  leading,
  // Margin props
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  // Padding props
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  className,
  style,
  children,
  ...rest
}: TextProps<T> & { style?: CSSProperties }) {
  const sprinklesClassName = textSprinkles({
    fontSize: normalizeResponsiveProp(size) as TextSprinkles['fontSize'],
    lineHeight: normalizeResponsiveProp(
      leading ?? size
    ) as TextSprinkles['lineHeight'],
    color: color as TextSprinkles['color'],
    backgroundColor: bg as TextSprinkles['backgroundColor'],
    fontWeight: normalizeResponsiveProp(weight) as TextSprinkles['fontWeight'],
    textAlign: normalizeResponsiveProp(align) as TextSprinkles['textAlign'],
    display: normalizeResponsiveProp(display) as TextSprinkles['display'],
    textDecoration: normalizeResponsiveProp(
      decoration
    ) as TextSprinkles['textDecoration'],
    textTransform: normalizeResponsiveProp(
      transform
    ) as TextSprinkles['textTransform'],
    textWrap: normalizeResponsiveProp(wrap) as TextSprinkles['textWrap'],
    whiteSpace: normalizeResponsiveProp(
      whiteSpace
    ) as TextSprinkles['whiteSpace'],
    wordBreak: normalizeResponsiveProp(wordBreak) as TextSprinkles['wordBreak'],
    overflowWrap: normalizeResponsiveProp(
      overflowWrap
    ) as TextSprinkles['overflowWrap'],
    letterSpacing: normalizeResponsiveProp(
      tracking
    ) as TextSprinkles['letterSpacing'],
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
    ) as TextSprinkles['marginRight'],
    padding: normalizeResponsiveProp(p) as TextSprinkles['padding'],
    paddingTop: normalizeResponsiveProp(
      pt ?? py
    ) as TextSprinkles['paddingTop'],
    paddingBottom: normalizeResponsiveProp(
      pb ?? py
    ) as TextSprinkles['paddingBottom'],
    paddingLeft: normalizeResponsiveProp(
      pl ?? px
    ) as TextSprinkles['paddingLeft'],
    paddingRight: normalizeResponsiveProp(
      pr ?? px
    ) as TextSprinkles['paddingRight']
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

  const Component = asChild ? Slot : (as ?? 'span')

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
