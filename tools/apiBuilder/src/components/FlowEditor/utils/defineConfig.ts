import type { IHandler, INodeConfig } from '../typescript/node'

export default function defineNodeConfig<
  D extends Record<string, any> | undefined
>() {
  return function <H extends Record<string, IHandler>>(
    config: INodeConfig<D, H>
  ) {
    return config
  }
}
