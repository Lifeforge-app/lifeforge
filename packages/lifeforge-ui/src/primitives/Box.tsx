import { clsx } from 'clsx'
import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../system'
import { Slot } from './Slot'
import { type BoxSprinkles, boxBase, boxSprinkles } from './box.css'

type SpaceValue = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

type BgColor =
  | 'transparent'
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

type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

type PositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'

type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'auto'

const DEFAULT_ELEMENT = 'div' as const

interface BoxOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT> {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  p?: ResponsiveProp<SpaceValue>
  px?: ResponsiveProp<SpaceValue>
  py?: ResponsiveProp<SpaceValue>
  pt?: ResponsiveProp<SpaceValue>
  pb?: ResponsiveProp<SpaceValue>
  pl?: ResponsiveProp<SpaceValue>
  pr?: ResponsiveProp<SpaceValue>
  m?: ResponsiveProp<SpaceValue>
  mx?: ResponsiveProp<SpaceValue>
  my?: ResponsiveProp<SpaceValue>
  mt?: ResponsiveProp<SpaceValue>
  mb?: ResponsiveProp<SpaceValue>
  ml?: ResponsiveProp<SpaceValue>
  mr?: ResponsiveProp<SpaceValue>
  bg?: ResponsiveProp<BgColor>
  rounded?: ResponsiveProp<RadiusValue>
  display?: ResponsiveProp<DisplayValue>
  position?: ResponsiveProp<PositionValue>
  overflow?: ResponsiveProp<OverflowValue>
  className?: string
  children?: ReactNode
}

export type BoxProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  BoxOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof BoxOwnProps<T>>

export function Box<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  bg,
  rounded,
  display,
  position,
  overflow,
  className,
  children,
  ...rest
}: BoxProps<T>) {
  const sprinklesClassName = boxSprinkles({
    display: normalizeResponsiveProp(display) as BoxSprinkles['display'],
    position: normalizeResponsiveProp(position) as BoxSprinkles['position'],
    overflow: normalizeResponsiveProp(overflow) as BoxSprinkles['overflow'],
    padding: normalizeResponsiveProp(p) as BoxSprinkles['padding'],
    paddingTop: normalizeResponsiveProp(pt ?? py) as BoxSprinkles['paddingTop'],
    paddingBottom: normalizeResponsiveProp(
      pb ?? py
    ) as BoxSprinkles['paddingBottom'],
    paddingLeft: normalizeResponsiveProp(
      pl ?? px
    ) as BoxSprinkles['paddingLeft'],
    paddingRight: normalizeResponsiveProp(
      pr ?? px
    ) as BoxSprinkles['paddingRight'],
    margin: normalizeResponsiveProp(m) as BoxSprinkles['margin'],
    marginTop: normalizeResponsiveProp(mt ?? my) as BoxSprinkles['marginTop'],
    marginBottom: normalizeResponsiveProp(
      mb ?? my
    ) as BoxSprinkles['marginBottom'],
    marginLeft: normalizeResponsiveProp(ml ?? mx) as BoxSprinkles['marginLeft'],
    marginRight: normalizeResponsiveProp(
      mr ?? mx
    ) as BoxSprinkles['marginRight'],
    backgroundColor: normalizeResponsiveProp(
      bg
    ) as BoxSprinkles['backgroundColor'],
    borderRadius: normalizeResponsiveProp(
      rounded
    ) as BoxSprinkles['borderRadius']
  })

  const Component = asChild ? Slot : (as ?? DEFAULT_ELEMENT)

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(boxBase(), sprinklesClassName, className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
