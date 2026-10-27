declare module 'virtual:__federation__' {
  export function __federation_method_getRemote(
    remote: string,
    module: string
  ): Promise<unknown>
  export function __federation_method_setRemote(
    remote: string,
    config: unknown
  ): void
  export function __federation_method_unwrapDefault(module: unknown): unknown
}
