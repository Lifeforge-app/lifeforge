/**
 * Per-proxy routing metadata. The host binds `remoteId` after a federated
 * module is loaded, so modules never need to know their own remote name.
 */
export interface ProxyScope {
  remoteId?: string
}

/** Global configuration shared by every forge proxy in the app. */
export const forgeConfig: { apiHost: string } = {
  apiHost: ''
}

export function configureForge(config: { apiHost?: string }): void {
  if (config.apiHost !== undefined) {
    forgeConfig.apiHost = config.apiHost
  }
}
