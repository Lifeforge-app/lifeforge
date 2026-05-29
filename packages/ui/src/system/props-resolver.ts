/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties } from '@vanilla-extract/css'
import clsx from 'clsx'

import type { ArbitraryProps } from './arbitrary'
import type { ResponsiveProp } from './responsive'
import { getResponsiveLayoutStyles } from './responsive/utils/getResponsiveLayoutStyles'

type AnySprinklesFn = {
  (props: any): string
  properties: Set<string>
}

type SprinklesProps<T extends AnySprinklesFn> = Parameters<T>[0]

type ResolveResponsiveOutputs<T> = {
  [K in keyof T]: NonNullable<T[K]> extends ResponsiveProp<
    infer TInput,
    infer TOutput,
    any
  >
    ? ResponsiveProp<TInput, TOutput, 'output'>
    : T[K]
}

type ResolveStylesOptions<
  T extends AnySprinklesFn,
  TComponentArbitraryProps extends object = {}
> = {
  sprinkles: T
  sprinkleProps: Partial<SprinklesProps<T>>
  arbitraryProps?: Partial<ResolveResponsiveOutputs<ArbitraryProps>>
  componentArbitraryProps?: Partial<
    ResolveResponsiveOutputs<TComponentArbitraryProps>
  >
  style?: CSSProperties
  className?: string
}

export function resolveStyles<
  T extends AnySprinklesFn,
  TComponentArbitraryProps extends object = {}
>({
  sprinkles,
  sprinkleProps,
  arbitraryProps,
  componentArbitraryProps,
  style,
  className
}: ResolveStylesOptions<T, TComponentArbitraryProps>) {
  const sprinklesClassName = sprinkles(sprinkleProps as SprinklesProps<T>)

  const responsiveStyles = getResponsiveLayoutStyles({
    ...arbitraryProps,
    ...componentArbitraryProps
  })

  return {
    className: clsx(sprinklesClassName, responsiveStyles.className, className),
    style: {
      ...responsiveStyles.style,
      ...style
    } as CSSProperties
  }
}
