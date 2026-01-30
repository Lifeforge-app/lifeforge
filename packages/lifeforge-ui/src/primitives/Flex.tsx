import { clsx } from 'clsx'
import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../system'
import { Slot } from './Slot'
import { type FlexSprinkles, flexBase, flexSprinkles } from './flex.css'

type SpaceValue = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type DirectionValue = 'row' | 'column' | 'row-reverse' | 'column-reverse'

type AlignValue = 'stretch' | 'center' | 'start' | 'end'

type JustifyValue = 'start' | 'center' | 'between' | 'around' | 'evenly' | 'end'

type WrapValue = 'nowrap' | 'wrap' | 'wrap-reverse'

const DEFAULT_ELEMENT = 'div' as const

interface FlexOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT> {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  direction?: ResponsiveProp<DirectionValue>
  gap?: ResponsiveProp<SpaceValue>
  align?: ResponsiveProp<AlignValue>
  justify?: ResponsiveProp<JustifyValue>
  grow?: ResponsiveProp<boolean>
  shrink?: ResponsiveProp<boolean>
  wrap?: ResponsiveProp<WrapValue>
  inline?: boolean
  className?: string
  children?: ReactNode
}

export type FlexProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  FlexOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof FlexOwnProps<T>>

const alignMap: Record<AlignValue, FlexSprinkles['alignItems']> = {
  stretch: 'stretch',
  center: 'center',
  start: 'flex-start',
  end: 'flex-end'
}

const justifyMap: Record<JustifyValue, FlexSprinkles['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  end: 'flex-end'
}

export function Flex<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
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

  const Component = asChild ? Slot : (as ?? DEFAULT_ELEMENT)

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
