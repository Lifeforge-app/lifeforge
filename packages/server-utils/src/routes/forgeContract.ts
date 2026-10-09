import { type AnyRelations } from 'drizzle-orm'
import { type PgTable } from 'drizzle-orm/pg-core'
import type { RequestHandler } from 'express'
import type { z } from 'zod'

import { defineModuleSchema } from '@lifeforge/drizzle'
import {
  type BuiltModuleSchema,
  ModuleRegistry,
  type ModuleSchema
} from '@lifeforge/module-registry'

import { getCallerModuleId } from '..'
import { type ExistsInFor, existsIn } from '../database'
import {
  type OutputDefinition,
  type ResponseObject,
  createOutputHelpers
} from '../response'
import type {
  ForgeContext,
  ForgeContract,
  ForgeExpressContext
} from '../typescript/core/forge_contract.types'
import type {
  ConvertMedia,
  MediaConfig
} from '../typescript/standalone/media.types'

export interface ForgeContractOptions<
  TModuleSchema extends ModuleSchema = ModuleSchema
> {
  schema?: TModuleSchema
  moduleId?: string
  modulePathAlias?: string
}

type TablesOf<T> = T extends { tables: infer TT } ? TT : Record<string, PgTable>

type ForgeBuilderFor<
  TSchema extends AnyRelations,
  TOptions extends ForgeContractOptions
> = ReturnType<
  typeof makeBuilder<
    TOptions['schema'] extends ModuleSchema
      ? BuiltModuleSchema<TOptions['schema']>
      : TSchema,
    TablesOf<TOptions['schema']>
  >
>

function makeBuilder<
  TSchema extends AnyRelations = any,
  TTables extends Record<string, PgTable> = Record<string, PgTable>
>(config: { callerModule?: string; modulePathAlias?: string }) {
  const { callerModule, modulePathAlias } = config

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
      media?: TMedia
      middlewares?: RequestHandler[]
      rateLimit?: boolean
    }
  ) {
    return {
      callback: function (
        cb: (
          context: ForgeContext<TQuery, TBody, TOutput, TMedia, TSchema>
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
              ctx: ForgeExpressContext<TSchema>
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
                db: ctx.db,
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
              description: metadata.description,
              isDownloadable: metadata.isDownloadable ?? false,
              media: (metadata.media ?? null) as TMedia,
              noAuth: metadata.noAuth ?? false,
              encrypted: metadata.encrypted ?? true,
              rateLimit: metadata.rateLimit ?? true,
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
      media?: TMedia
      middlewares?: RequestHandler[]
      rateLimit?: boolean
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
      media?: TMedia
      middlewares?: RequestHandler[]
      rateLimit?: boolean
    }) {
      return buildRoute<'post', TOutput, TQuery, TBody, TMedia>(
        'post',
        metadata
      )
    },

    existsIn: existsIn as unknown as ExistsInFor<TTables>
  }
}

export function createForgeContractBuilder<
  TSchema extends AnyRelations = any,
  TOptions extends ForgeContractOptions = ForgeContractOptions
>(options?: TOptions): ForgeBuilderFor<TSchema, TOptions> {
  const { schema, moduleId, modulePathAlias } = options ?? {}

  if (schema) {
    const caller = getCallerModuleId()

    const moduleId = caller?.source === 'app' ? caller.id : undefined

    const definition = defineModuleSchema(
      schema.tables,
      schema.relations as any,
      moduleId
    )

    if (moduleId) {
      ModuleRegistry.registerSchemaPart(moduleId, definition)
    }
  }

  return makeBuilder({
    callerModule: moduleId,
    modulePathAlias
  }) as unknown as ForgeBuilderFor<TSchema, TOptions>
}

export default createForgeContractBuilder
