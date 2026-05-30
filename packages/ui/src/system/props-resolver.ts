/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import type { CSSProperties } from 'react'

import type { ArbitraryProps } from './arbitrary'
import { type ColorPropName, type ColorProps, resolveColorProp } from './colors'
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
  colorProps?: ColorProps
  style?: CSSProperties
  className?: string
}

export interface ResolvedStyle {
  className: string
  style: CSSProperties
}

export function mergeStyle(...styles: ResolvedStyle[]): ResolvedStyle {
  return {
    className: clsx(...styles.map(s => s.className)),
    style: Object.assign({}, ...styles.map(s => s.style))
  }
}

export function resolveStyles<
  T extends AnySprinklesFn,
  TComponentArbitraryProps extends object = {}
>({
  sprinkles,
  sprinkleProps,
  arbitraryProps,
  componentArbitraryProps,
  colorProps,
  style,
  className
}: ResolveStylesOptions<T, TComponentArbitraryProps>): ResolvedStyle {
  const sprinklesClassName = sprinkles(sprinkleProps as SprinklesProps<T>)

  const responsiveStyles = getResponsiveLayoutStyles({
    ...arbitraryProps,
    ...componentArbitraryProps
  })

  const colorStyles = Object.entries(colorProps || {}).reduce<ResolvedStyle>(
    (acc, [key, value]) =>
      mergeStyle(acc, resolveColorProp(key as ColorPropName, value)),
    { className: '', style: {} }
  )

  return mergeStyle(responsiveStyles, colorStyles, {
    className: clsx(sprinklesClassName, className),
    style: style ?? {}
  })
}
