import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

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

type BgSlot =
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

type CustomSlot =
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

type SemanticColor = 'default' | 'muted' | 'primary' | 'inherit'

type TextColor = SemanticColor | BgSlot | CustomSlot

type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold'

type TextAlign = 'left' | 'center' | 'right'

type TextDecoration = 'underline' | 'line-through' | 'none'

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none'

const DEFAULT_ELEMENT = 'span' as const

interface TextOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT> {
  as?: T
  ref?: Ref<HTMLElement>
  size?: TextSize
  color?: TextColor
  weight?: FontWeight
  align?: TextAlign
  decoration?: TextDecoration
  transform?: TextTransform
  truncate?: boolean
  lineClamp?: number
  className?: string
  children?: ReactNode
}

export type TextProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  TextOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof TextOwnProps<T>>

const sizeMap: Record<TextSize, string> = {
  sm: 'var(--text-sm)',
  base: 'var(--text-base)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
  '2xl': 'var(--text-2xl)',
  '3xl': 'var(--text-3xl)',
  '4xl': 'var(--text-4xl)',
  '5xl': 'var(--text-5xl)',
  '6xl': 'var(--text-6xl)',
  '7xl': 'var(--text-7xl)',
  '8xl': 'var(--text-8xl)',
  '9xl': 'var(--text-9xl)'
}

const lineHeightMap: Record<TextSize, string> = {
  sm: 'var(--text-sm--line-height)',
  base: 'var(--text-base--line-height)',
  lg: 'var(--text-lg--line-height)',
  xl: 'var(--text-xl--line-height)',
  '2xl': 'var(--text-2xl--line-height)',
  '3xl': 'var(--text-3xl--line-height)',
  '4xl': 'var(--text-4xl--line-height)',
  '5xl': 'var(--text-5xl--line-height)',
  '6xl': 'var(--text-6xl--line-height)',
  '7xl': 'var(--text-7xl--line-height)',
  '8xl': 'var(--text-8xl--line-height)',
  '9xl': 'var(--text-9xl--line-height)'
}

const colorMap: Record<TextColor, string> = {
  default: 'var(--color-bg-900)',
  muted: 'var(--color-bg-500)',
  primary: 'var(--color-custom-500)',
  inherit: 'inherit',
  'bg-50': 'var(--color-bg-50)',
  'bg-100': 'var(--color-bg-100)',
  'bg-200': 'var(--color-bg-200)',
  'bg-300': 'var(--color-bg-300)',
  'bg-400': 'var(--color-bg-400)',
  'bg-500': 'var(--color-bg-500)',
  'bg-600': 'var(--color-bg-600)',
  'bg-700': 'var(--color-bg-700)',
  'bg-800': 'var(--color-bg-800)',
  'bg-900': 'var(--color-bg-900)',
  'bg-950': 'var(--color-bg-950)',
  'custom-50': 'var(--color-custom-50)',
  'custom-100': 'var(--color-custom-100)',
  'custom-200': 'var(--color-custom-200)',
  'custom-300': 'var(--color-custom-300)',
  'custom-400': 'var(--color-custom-400)',
  'custom-500': 'var(--color-custom-500)',
  'custom-600': 'var(--color-custom-600)',
  'custom-700': 'var(--color-custom-700)',
  'custom-800': 'var(--color-custom-800)',
  'custom-900': 'var(--color-custom-900)'
}

const weightMap: Record<FontWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
}

export function Text<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  ref,
  size,
  color,
  weight,
  align,
  decoration,
  transform,
  truncate,
  lineClamp,
  className,
  style,
  children,
  ...rest
}: TextProps<T> & { style?: CSSProperties }) {
  const Component = as ?? DEFAULT_ELEMENT

  const textStyle: CSSProperties = {
    ...style,
    ...(size && {
      fontSize: sizeMap[size],
      lineHeight: lineHeightMap[size]
    }),
    ...(color && { color: colorMap[color] }),
    ...(weight && { fontWeight: weightMap[weight] }),
    ...(align && { textAlign: align }),
    ...(decoration && { textDecoration: decoration }),
    ...(transform && { textTransform: transform }),
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }),
    ...(lineClamp && {
      display: '-webkit-box',
      WebkitLineClamp: lineClamp,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    })
  }

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(className)}
      style={textStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}
