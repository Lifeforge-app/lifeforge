import { z } from 'zod/v4'

import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const ALLOWED_NAMESPACE = ['apps', 'common', 'utils', 'core'] as const

const ALLOWED_LANG = ['en', 'ms', 'zh-CN', 'zh-TW', 'zh'] as const

const LocalesManager = {
  /**
   * @route       GET /:namespace
   * @description List subnamespaces for a namespace
   */
  listSubnamespaces: {
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE)
    }),
    response: z.array(z.string())
  },

  /**
   * @route       GET /:namespace/:subnamespace
   * @description List locales for a namespace and subnamespace
   */
  listLocales: {
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    }),
    response: z.record(z.enum(ALLOWED_LANG).exclude(['zh']), z.string())
  },

  /**
   * @route       POST /sync/:namespace/:subnamespace
   * @description Sync locales for a namespace and subnamespace
   */
  syncLocales: {
    body: z.object({
      data: z.record(
        z.string(),
        z.record(z.enum(ALLOWED_LANG).exclude(['zh']), z.string())
      )
    }),
    params: z.object({
      namespace: z.enum(['apps', 'common', 'utils', 'core']),
      subnamespace: z.string()
    }),
    response: z.boolean()
  },

  /**
   * @route       POST /:type/:namespace/:subnamespace
   * @description Create a new locale entry or folder
   */
  createLocale: {
    params: z.object({
      type: z.enum(['entry', 'folder']),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    }),
    body: z.object({
      path: z.string().optional().default('')
    }),
    response: z.boolean()
  },

  /**
   * @route       PATCH /:namespace/:subnamespace
   * @description Rename a locale
   */
  renameLocale: {
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    }),
    body: z.object({
      path: z.string().optional().default(''),
      newName: z.string().optional().default('')
    }),
    response: z.boolean()
  },

  /**
   * @route       DELETE /:namespace/:subnamespace
   * @description Delete a locale
   */
  deleteLocale: {
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    }),
    body: z.object({
      path: z.string().optional().default('')
    }),
    response: z.boolean()
  },

  /**
   * @route       POST /suggestions/:namespace/:subnamespace
   * @description Get translation suggestions
   */
  getTranslationSuggestions: {
    params: z.object({
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    }),
    body: z.object({
      path: z.string(),
      hint: z.string().optional().default('')
    }),
    response: z.object({
      en: z.string(),
      ms: z.string(),
      'zh-CN': z.string(),
      'zh-TW': z.string()
    })
  }
}

const Locales = {
  /**
   * @route       GET /:lang/:namespace/:subnamespace
   * @description Get locales for a specific language, namespace, and subnamespace
   */
  getLocales: {
    params: z.object({
      lang: z.enum(ALLOWED_LANG),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    }),
    response: z.any()
  }
}

type ILocalesManager = InferApiESchemaDynamic<typeof LocalesManager>
type ILocales = InferApiESchemaDynamic<typeof Locales>

export type { ILocalesManager, ILocales }

export { LocalesManager, Locales }
