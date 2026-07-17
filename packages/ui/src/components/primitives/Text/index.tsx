import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import {
  type ColorValue,
  type OverflowValue,
  type PositionValue,
  type ResponsiveProp,
  type ThemeConditionProp,
  type TokenizedLayoutProps,
  type TokenizedSpacingProps,
  normalizeResponsiveProp,
  resolveLayoutSprinklesProps,
  resolveSpacingSprinklesProps,
  resolveStyles
} from '@/system'

import { Slot } from '../Slot'
import { type TextSprinkles, textBase, textSprinkles } from './Text.css'

type TextSize =
  | 'xs'
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
  'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'break-spaces'

type TextWordBreak = 'normal' | 'break-all' | 'keep-all'

type TextOverflowWrap = 'normal' | 'break-word' | 'anywhere'

type TextTrim = 'normal' | 'start' | 'end' | 'both'

interface TextOwnProps<T extends ElementType = 'span'>
  extends TokenizedSpacingProps, TokenizedLayoutProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  size?: ResponsiveProp<TextSize>
  color?: ThemeConditionProp<ColorValue>
  bg?: ThemeConditionProp<ColorValue>
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
  overflow?: ResponsiveProp<OverflowValue>
  overflowX?: ResponsiveProp<OverflowValue>
  overflowY?: ResponsiveProp<OverflowValue>
  position?: ResponsiveProp<PositionValue>
  className?: string
  children?: ReactNode
}

export type TextProps<T extends ElementType = 'span'> = TextOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof TextOwnProps<T>>

const trimMap = {
  normal: '',
  start: 'trim-start',
  end: 'trim-end',
  both: 'trim-both'
} as const satisfies Record<TextTrim, string>

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
  // Layout props
  overflow,
  overflowX,
  overflowY,
  position,
  className,
  style,
  children,
  ...rest
}: TextProps<T> & { style?: CSSProperties }) {
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

  const Component = asChild ? Slot : (as ?? 'span')

  const styles = resolveStyles({
    sprinkles: textSprinkles,
    sprinkleProps: {
      fontSize: normalizeResponsiveProp(size) as TextSprinkles['fontSize'],
      lineHeight: normalizeResponsiveProp(leading ?? size),
      trim: normalizeResponsiveProp(trim, v => trimMap[v]),
      fontWeight: normalizeResponsiveProp(
        weight
      ) as TextSprinkles['fontWeight'],
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
      wordBreak: normalizeResponsiveProp(
        wordBreak
      ) as TextSprinkles['wordBreak'],
      overflowWrap: normalizeResponsiveProp(
        overflowWrap
      ) as TextSprinkles['overflowWrap'],
      letterSpacing: normalizeResponsiveProp(
        tracking
      ) as TextSprinkles['letterSpacing'],
      ...resolveSpacingSprinklesProps({
        p,
        px,
        py,
        pt,
        pr,
        pb,
        pl,
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml
      }),
      ...resolveLayoutSprinklesProps({
        overflow,
        overflowX,
        overflowY,
        position
      })
    },
    colorProps: { color, bg },
    style: {
      ...style,
      ...truncateStyle,
      ...lineClampStyle
    },
    className: clsx(textBase(), className)
  })

  return (
    <Component ref={ref as Ref<never>} {...styles} {...rest}>
      {children}
    </Component>
  )
}
