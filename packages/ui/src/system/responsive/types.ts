export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface PropDef {
  className: string
  customProperties: `--${string}`[]
}

declare const __responsive_meta__: unique symbol

type ResponsiveObject<TValue, TInput, TOutput> = {
  [K in Breakpoint]?: TValue
} & {
  readonly [__responsive_meta__]?: {
    input: TInput
    output: TOutput
  }
}

export type ResponsiveProp<
  TInput,
  TOutput = TInput,
  Mode extends 'input' | 'output' = 'input'
> =
  | (Mode extends 'output' ? TOutput : TInput)
  | ResponsiveObject<Mode extends 'output' ? TOutput : TInput, TInput, TOutput>
