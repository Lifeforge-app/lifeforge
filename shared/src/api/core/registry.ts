export interface ForgeProxyContextValue {
  moduleId: string
  apiHost: string
}

export const globalProxyRegistry = new WeakMap<any, ForgeProxyContextValue>()
