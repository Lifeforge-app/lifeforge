type ValidateProvider<T> = T extends readonly [infer C, infer P]
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    C extends React.ComponentType<any>
    ? P extends Omit<React.ComponentProps<C>, 'children'>
      ? Omit<React.ComponentProps<C>, 'children'> extends P
        ? T
        : never
      : never
    : never
  : T extends readonly [infer C]
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      C extends React.ComponentType<any>
      ? T
      : never
    : never

type ValidateProviders<T extends readonly unknown[]> = {
  [K in keyof T]: ValidateProvider<T[K]>
}

function defineProviders<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly (readonly [React.ComponentType<any>, any?])[]
>(providers: ValidateProviders<T> & T): T {
  return providers
}

function constructComponentTree<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly (readonly [React.ComponentType<any>, any?])[]
>(providers: T): React.ReactElement | null {
  return providers.reduceRight<React.ReactElement | null>(
    (acc, [Component, props]) => {
      const componentProps = { ...props, children: acc }

      return <Component {...componentProps} />
    },
    null
  )
}

export { defineProviders, constructComponentTree }