export type InputVariant = 'classic' | 'plain'

export type InputSize = 'small' | 'default'

export type InputVariants<HasSize extends boolean = false> =
  HasSize extends true
    ? | { variant?: 'classic'; size?: 'default' }
      | { variant: 'plain'; size?: 'small' | 'default' }
    : { variant?: InputVariant }
