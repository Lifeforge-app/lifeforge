/**
 * Tracks the module id currently being imported. The loader sets this around
 * `await import(...)`, so anything the module executes at load time (schema
 * registration, route definitions) can resolve its own module id directly,
 * without fragile stack-trace parsing.
 *
 * Stored on `globalThis` so all instances of this package share it.
 */
const LOADING_MODULE_KEY = Symbol.for('lifeforge.module-runtime.loading-module')

export function setLoadingModuleId(id: string | undefined): void {
  const globalObject = globalThis as unknown as Record<
    symbol,
    string | undefined
  >

  if (id === undefined) {
    delete globalObject[LOADING_MODULE_KEY]
  } else {
    globalObject[LOADING_MODULE_KEY] = id
  }
}

export function getLoadingModuleId(): string | undefined {
  return (globalThis as unknown as Record<symbol, string | undefined>)[
    LOADING_MODULE_KEY
  ]
}
