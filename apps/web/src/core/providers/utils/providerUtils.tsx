/**
 * Validates that a provider tuple matches the expected shape.
 *
 * Accepts `[Component, props?]` where:
 * - `Component` is a React component type
 * - `props` (if provided) is assignable to the component's props excluding `children`
 *
 * Returns `T` if valid, `never` otherwise.
 */
type ValidateProvider<T> = T extends readonly [infer C, infer P]
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    C extends React.ComponentType<any>
    ? P extends Omit<React.ComponentProps<C>, 'children'>
      ? T
      : never
    : never
  : T extends readonly [infer C]
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      C extends React.ComponentType<any>
      ? T
      : never
    : never

/**
 * Maps over a tuple of providers, validating each entry with `ValidateProvider`.
 */
type ValidateProviders<T extends readonly unknown[]> = {
  [K in keyof T]: ValidateProvider<T[K]>
}

/**
 * Defines a list of providers with compile-time type validation.
 *
 * Each entry must be a tuple `[Component, props?]` where `props` (if provided)
 * matches the component's props excluding `children`. The list is returned as-is
 * but with narrowed types for downstream use.
 *
 * @example
 * defineProviders([
 *   [ToastProvider],
 *   [QueryClientProvider, { client: queryClient }]
 * ] as const)
 */
function defineProviders<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly (readonly [React.ComponentType<any>, any?])[]
>(providers: ValidateProviders<T> & T): T {
  return providers
}

/**
 * Builds a nested React element tree from a list of provider tuples.
 *
 * Providers are nested inside-out (last entry wraps the outermost, first entry wraps the innermost).
 * Each provider receives `children` set to the tree built from providers to its right.
 *
 * @example
 * // [[A], [B, { x: 1 }]] → <A><B x={1}>{null}</B></A>
 * constructComponentTree([[A], [B, { x: 1 }]])
 */
function constructComponentTree<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly (readonly [React.ComponentType<any>, any?])[]
>(providers: T): React.ReactElement {
  return providers.reduceRight<React.ReactElement>(
    (acc, [Component, props]) => {
      const componentProps = { ...props, children: acc }

      return <Component {...componentProps} />
    },
    <></>
  )
}

export { defineProviders, constructComponentTree }
