import * as reactQuery from '@tanstack/react-query'
import * as i18next from 'i18next'
import * as nuqs from 'nuqs'
import * as nuqsReact from 'nuqs/adapters/react'
import * as react from 'react'
import * as reactDom from 'react-dom'
import * as reactI18next from 'react-i18next'
import * as reactRouter from 'react-router'
import * as reactJsxRuntime from 'react/jsx-runtime'

import * as api from '@lifeforge/api'
import * as federation from '@lifeforge/federation'
import * as localization from '@lifeforge/localization'
import * as ui from '@lifeforge/ui'

/**
 * Mirrors the normalized module shape produced by the federation plugin's
 * shared loaders. Some CommonJS packages expose their API on `default`, in
 * which case the default export is what remotes expect to read.
 */
function normalizeModule(module: Record<string, unknown>) {
  let current = module

  for (let index = 0; index < 5; index++) {
    const defaultExport = current.default

    if (!defaultExport || typeof defaultExport !== 'object') break

    const namedExports = Object.keys(current)
      .filter(key => key !== 'default')
      .map(key => current[key])

    if (
      namedExports.length > 0 &&
      namedExports.some(value => value !== undefined)
    ) {
      break
    }

    current = defaultExport as Record<string, unknown>
  }

  return current && Object.getPrototypeOf(current) === null
    ? Object.assign({}, current)
    : current
}

const DEV_SHARED_MODULES: Record<string, Record<string, unknown>> = {
  react,
  'react/jsx-runtime': reactJsxRuntime,
  'react-dom': reactDom,
  '@lifeforge/api': api,
  '@lifeforge/federation': federation,
  '@lifeforge/localization': localization,
  'react-router': reactRouter,
  'nuqs/adapters/react': nuqsReact,
  nuqs,
  '@lifeforge/ui': ui,
  '@tanstack/react-query': reactQuery,
  i18next,
  'react-i18next': reactI18next
}

interface ModuleFederationCache {
  share: Record<string, unknown>
  remote: Record<string, unknown>
}

/**
 * Seeds the shared module cache used by Vite-built federation remotes.
 *
 * The dev server loads modules with source directly and does not run the
 * federation plugin for them, so the host never populates the cache. Modules
 * without source still load their built federation bundle, and that bundle
 * reads shared modules (React included) from this cache before falling back to
 * its own bundled copies. Without seeding it, a remote renders its components
 * with a second React instance, so hooks crash on a null React internals
 * object. Sharing the host instances also keeps the API registry, UI context,
 * and i18n instances in sync between host and remote.
 */
export function installDevSharedModules() {
  if (!import.meta.env.DEV) {
    return
  }

  const globalObject = globalThis as typeof globalThis & {
    __mf_module_cache__?: ModuleFederationCache
  }

  globalObject.__mf_module_cache__ ??= {
    share: {},
    remote: {}
  }

  const cache = globalObject.__mf_module_cache__

  cache.share ??= {}
  cache.remote ??= {}

  for (const [name, module] of Object.entries(DEV_SHARED_MODULES)) {
    const canonicalName = `default:${name}`

    if (cache.share[canonicalName] !== undefined) continue

    const value = normalizeModule(module)

    cache.share[canonicalName] = value

    Object.defineProperty(cache.share, name, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  }
}
