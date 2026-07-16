import type { RequestHandler } from 'express'
import type { z } from 'zod'

import { getCallerModuleId } from '..'
import type {
  ForgeContext,
  ForgeContract,
  ForgeExpressContext
} from '../typescript/core/forge_contract.types'
import {
  type IPBService,
  type CollectionKey,
  type CleanedSchemas
} from '@lifeforge/pocketbase'
import type {
  OutputDefinition,
  OutputHelpers,
  ResponseObject
} from '../typescript/response/response_helpers.types'
import type {
  ConvertMedia,
  MediaConfig
} from '../typescript/standalone/media.types'
import { Output, OutputType } from '../utils/outputStatus'

type KeysOf<T> = T extends any ? keyof T : never

export function snakeCaseToCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function createOutputHelpers<
  TOutput extends OutputDefinition | 'custom'
>(output: TOutput): OutputHelpers<TOutput> {
  const helpers = {} as Record<
    string,
    (payload?: unknown) => { $status: number; payload?: unknown }
  >

  if (output === 'custom') {
    return helpers as unknown as OutputHelpers<TOutput>
  }

  for (const key of Object.keys(output)) {
    const camelKey = snakeCaseToCamelCase(key)

    const outputDef = Output[key as keyof OutputType]

    const status = outputDef?.$status ?? 200

    const hasPayload =
      outputDef && 'hasPayload' in outputDef
        ? (outputDef as { hasPayload: boolean }).hasPayload
        : false

    helpers[camelKey] = function (payload?: unknown) {
      return {
        $status: status,
        ...(hasPayload ? { payload } : {})
      }
    }
  }

  return helpers as unknown as OutputHelpers<TOutput>
}

export function createForgeContractBuilder<TSchemas extends CleanedSchemas>(
  _schemas: TSchemas,
  callerModuleOrOptions?: string | { modulePathAlias?: string }
) {
  const callerModule =
    typeof callerModuleOrOptions === 'string'
      ? callerModuleOrOptions
      : undefined
  const modulePathAlias =
    typeof callerModuleOrOptions === 'object'
      ? callerModuleOrOptions.modulePathAlias
      : undefined

  function buildRoute<
    TMethod extends 'get' | 'post',
    const TOutput extends OutputDefinition | 'custom',
    TQuery extends z.ZodTypeAny | undefined = undefined,
    TBody extends z.ZodTypeAny | undefined = undefined,
    TMedia extends MediaConfig | null = null
  >(
    method: TMethod,
    metadata: {
      description: string
      input?: {
        query?: TQuery
        body?: TBody
      }
      output: TOutput
      noAuth?: boolean
      encrypted?: boolean
      isDownloadable?: boolean
      existenceCheck?: 'NOT_FOUND' extends keyof TOutput
        ? {
            body?: Partial<
              Record<
                TBody extends z.ZodTypeAny ? KeysOf<z.infer<TBody>> : string,
                CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
              >
            >
            query?: Partial<
              Record<
                TQuery extends z.ZodTypeAny ? KeysOf<z.infer<TQuery>> : string,
                CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
              >
            >
          }
        : 'Error: If existenceCheck is defined, NOT_FOUND must be present in the output definition'
      media?: TMedia
      middlewares?: RequestHandler[]
    }
  ) {
    return {
      callback: function (
        cb: (
          context: ForgeContext<TSchemas, TQuery, TBody, TOutput, TMedia>
        ) => Promise<ResponseObject<TOutput>>
      ): ForgeContract {
        const caller = getCallerModuleId()

        const actualCallerModule =
          caller?.source === 'app'
            ? caller
            : callerModule
              ? { source: 'core', id: callerModule }
              : undefined

        return {
          __isForgeContract: true as const,
          modulePathAlias,
          getValue() {
            const callbackWrapper = async function (
              ctx: ForgeExpressContext
            ): Promise<{ $status: number; payload?: unknown }> {
              const responseHelpers = createOutputHelpers(metadata.output)

              return (await cb({
                response: responseHelpers,
                body: ctx.body as TBody extends z.ZodTypeAny
                  ? z.infer<TBody>
                  : undefined,
                query: ctx.query as TQuery extends z.ZodTypeAny
                  ? z.infer<TQuery>
                  : undefined,
                media: ctx.media as ConvertMedia<TMedia>,
                req: ctx.req,
                res: ctx.res,
                io: ctx.io,
                pb: ctx.pb as IPBService<TSchemas>,
                core: ctx.core
              })) as any
            }

            return {
              method,
              middlewares: metadata.middlewares ?? [],
              schema: {
                query: metadata.input?.query as TQuery,
                body: metadata.input?.body as TBody
              },
              output: metadata.output as OutputDefinition | 'custom',
              noDefaultResponse: false,
              existenceCheck: (metadata.existenceCheck ?? {}) as {
                body?: Record<string, string>
                query?: Record<string, string>
              },
              description: metadata.description,
              isDownloadable: metadata.isDownloadable ?? false,
              media: (metadata.media ?? null) as TMedia,
              noAuth: metadata.noAuth ?? false,
              encrypted: metadata.encrypted ?? true,
              callback: callbackWrapper,
              callerModule: actualCallerModule
            }
          }
        }
      }
    }
  }

  return {
    query: function <
      const TOutput extends OutputDefinition | 'custom',
      TQuery extends z.ZodTypeAny | undefined = undefined,
      TMedia extends MediaConfig | null = null
    >(metadata: {
      description: string
      input?: {
        query?: TQuery
        body?: never
      }
      output: TOutput
      noAuth?: boolean
      encrypted?: boolean
      isDownloadable?: boolean
      existenceCheck?: 'NOT_FOUND' extends keyof TOutput
        ? {
            body?: never
            query?: Partial<
              Record<
                TQuery extends z.ZodTypeAny ? KeysOf<z.infer<TQuery>> : string,
                CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
              >
            >
          }
        : 'Error: If existenceCheck is defined, NOT_FOUND must be present in the output definition'
      media?: TMedia
      middlewares?: RequestHandler[]
    }) {
      return buildRoute<'get', TOutput, TQuery, never, TMedia>(
        'get',
        metadata as any
      )
    },

    mutation: function <
      const TOutput extends OutputDefinition | 'custom',
      TQuery extends z.ZodTypeAny | undefined = undefined,
      TBody extends z.ZodTypeAny | undefined = undefined,
      TMedia extends MediaConfig | null = null
    >(metadata: {
      description: string
      input?: {
        query?: TQuery
        body?: TBody
      }
      output: TOutput
      noAuth?: boolean
      encrypted?: boolean
      isDownloadable?: boolean
      existenceCheck?: 'NOT_FOUND' extends keyof TOutput
        ? {
            body?: Partial<
              Record<
                TBody extends z.ZodTypeAny ? KeysOf<z.infer<TBody>> : string,
                CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
              >
            >
            query?: Partial<
              Record<
                TQuery extends z.ZodTypeAny ? KeysOf<z.infer<TQuery>> : string,
                CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
              >
            >
          }
        : 'Error: If existenceCheck is defined, NOT_FOUND must be present in the output definition'
      media?: TMedia
      middlewares?: RequestHandler[]
    }) {
      return buildRoute<'post', TOutput, TQuery, TBody, TMedia>(
        'post',
        metadata
      )
    }
  }
}

export default createForgeContractBuilder
