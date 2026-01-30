import { clsx } from 'clsx'
import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../system'
import { type FlexSprinkles, flexBase, flexSprinkles } from './flex.css'

/**
 * Spacing token values
 */
type SpaceValue = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Flex direction values
 */
type DirectionValue = 'row' | 'column' | 'row-reverse' | 'column-reverse'

/**
 * Align items values
 */
type AlignValue = 'stretch' | 'center' | 'start' | 'end'

/**
 * Justify content values
 */
type JustifyValue = 'start' | 'center' | 'between' | 'around' | 'evenly' | 'end'

/**
 * Flex wrap values
 */
type WrapValue = 'nowrap' | 'wrap' | 'wrap-reverse'

/**
 * Default element type for Flex component
 */
const DEFAULT_ELEMENT = 'div' as const

/**
 * Base props for Flex component (without element-specific props)
 */
interface FlexOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT> {
  /**
   * The element type to render as
   * @default 'div'
   */
  as?: T
  /**
   * Ref to the underlying element
   */
  ref?: Ref<HTMLElement>
  /**
   * Flex direction - responsive
   * @default 'row'
   */
  direction?: ResponsiveProp<DirectionValue>
  /**
   * Gap between children - responsive, uses spacing tokens
   */
  gap?: ResponsiveProp<SpaceValue>
  /**
   * Align items on the cross axis
   */
  align?: ResponsiveProp<AlignValue>
  /**
   * Justify content on the main axis
   */
  justify?: ResponsiveProp<JustifyValue>
  /**
   * Flex grow - responsive
   */
  grow?: ResponsiveProp<boolean>
  /**
   * Flex shrink - responsive
   */
  shrink?: ResponsiveProp<boolean>
  /**
   * Flex wrap - responsive
   */
  wrap?: ResponsiveProp<WrapValue>
  /**
   * Use inline-flex instead of flex
   * @default false
   */
  inline?: boolean
  /**
   * Additional class name
   */
  className?: string
  /**
   * Children elements
   */
  children?: ReactNode
}

/**
 * Flex component props - combines own props with element-specific props
 */
export type FlexProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  FlexOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof FlexOwnProps<T>>

/**
 * Maps align prop values to CSS alignItems values
 */
const alignMap: Record<AlignValue, FlexSprinkles['alignItems']> = {
  stretch: 'stretch',
  center: 'center',
  start: 'flex-start',
  end: 'flex-end'
}

/**
 * Maps justify prop values to CSS justifyContent values
 */
const justifyMap: Record<JustifyValue, FlexSprinkles['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  end: 'flex-end'
}

/**
 * Flex layout primitive component
 *
 * A production-grade flexbox layout component with responsive support.
 * All CSS is generated at build time via vanilla-extract.
 *
 * @example
 * ```tsx
 * <Flex
 *   direction={{ base: 'column', lg: 'row' }}
 *   gap={{ base: 'sm', lg: 'md' }}
 *   align="center"
 *   justify="between"
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 *
 * // Render as a different element
 * <Flex as="section" gap="md">
 *   <article>Content</article>
 * </Flex>
 * ```
 */
export function Flex<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  ref,
  direction,
  gap,
  align,
  justify,
  grow,
  shrink,
  wrap,
  inline = false,
  className,
  children,
  ...rest
}: FlexProps<T>) {
  const Component = as ?? DEFAULT_ELEMENT

  const sprinklesClassName = flexSprinkles({
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: normalizeResponsiveProp(
      direction
    ) as FlexSprinkles['flexDirection'],
    gap: normalizeResponsiveProp(gap) as FlexSprinkles['gap'],
    alignItems: normalizeResponsiveProp(
      align,
      v => alignMap[v]
    ) as FlexSprinkles['alignItems'],
    justifyContent: normalizeResponsiveProp(
      justify,
      v => justifyMap[v]
    ) as FlexSprinkles['justifyContent'],
    flexGrow: normalizeResponsiveProp(grow, v =>
      v ? 1 : 0
    ) as FlexSprinkles['flexGrow'],
    flexShrink: normalizeResponsiveProp(shrink, v =>
      v ? 1 : 0
    ) as FlexSprinkles['flexShrink'],
    flexWrap: normalizeResponsiveProp(wrap) as FlexSprinkles['flexWrap']
  })

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(flexBase(), sprinklesClassName, className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
