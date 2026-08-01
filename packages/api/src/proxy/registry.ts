class ProxyRegistry {
  private contexts = new WeakMap<any, { moduleId: string }>()
  public apiHost = ''

  set(contract: any, value: { moduleId: string; apiHost?: string }) {
    if (value.apiHost) {
      this.apiHost = value.apiHost
    }
    this.contexts.set(contract, { moduleId: value.moduleId })
  }

  get(contract: any) {
    const ctx = this.contexts.get(contract)

    if (!ctx) return undefined

    return {
      moduleId: ctx.moduleId,
      apiHost: this.apiHost
    }
  }
}

export const globalProxyRegistry = new ProxyRegistry()
