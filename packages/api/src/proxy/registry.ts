class ProxyRegistry {
  private contexts = new WeakMap<any, { remoteId: string }>()
  public apiHost = ''

  set(contract: any, value: { remoteId: string; apiHost?: string }) {
    if (value.apiHost) {
      this.apiHost = value.apiHost
    }
    this.contexts.set(contract, { remoteId: value.remoteId })
  }

  get(contract: any) {
    const ctx = this.contexts.get(contract)

    if (!ctx) return undefined

    return {
      remoteId: ctx.remoteId,
      apiHost: this.apiHost
    }
  }
}

export const globalProxyRegistry = new ProxyRegistry()
