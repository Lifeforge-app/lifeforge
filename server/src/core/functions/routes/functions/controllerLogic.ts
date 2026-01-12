/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Controller Logic - Business logic for Express.js route controllers
 *
 * This module provides the runtime logic for processing requests:
 * - Authentication validation
 * - Request/response validation using Zod schemas
 * - Built-in error handling and standardized responses
 * - Existence checking for referenced entities
 * - Encryption/decryption support
 * - File upload handling
 *
 * The main export is:
 * - `registerController`: Function to register a ForgeControllerBuilder with an Express router
 */
import type { Request, Response, Router } from 'express'

import { encryptResponse } from '@functions/encryption'
import { coreLogger } from '@functions/logging'

import {
  BaseResponse,
  ConvertMedia,
  MediaConfig
} from '../typescript/forge_controller.types'
import checkRecordExistence from '../utils/checkRecordExistence'
import { createCoreContext } from '../utils/coreContext'
import getAESKey from '../utils/getAESKey'
import parseBodyPayload from '../utils/parsePayload'
import parseQuery from '../utils/parseQuery'
import {
  ClientError,
  clientError,
  serverError,
  success
} from '../utils/response'
import fieldsUploadMiddleware from '../utils/uploadMiddleware'
import isAuthTokenValid from '../utils/validateAuthToken'
import { ForgeControllerBuilder } from './forgeController'

// ============================================================================
// Private Handler Creator
// ============================================================================

/**
 * Creates an Express request handler from a ForgeControllerBuilder's configuration.
 * This is kept private and only used internally by registerController.
 */
function createHandler<
  TMethod extends 'get' | 'post',
  TInput extends { body?: any; query?: any },
  TOutput,
  TMedia extends MediaConfig | null
>(
  config: ReturnType<
    ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia>['getValue']
  >
): ((req: Request, res: Response<BaseResponse<TOutput>>) => Promise<void>) & {
  meta: {
    schema: TInput
    description: string
    options: {
      statusCode: number
      noDefaultResponse: boolean
      existenceCheck: any
      isDownloadable: boolean
      encrypted: boolean
    }
  }
} {
  const {
    schema,
    statusCode,
    noDefaultResponse,
    existenceCheck,
    isDownloadable,
    media,
    noAuth,
    encrypted,
    callback,
    callerModule,
    description
  } = config

  const _handler = async (
    req: Request,
    res: Response<BaseResponse<TOutput>>
  ) => {
    const callerModuleId = callerModule
      ? `${callerModule.source}:${callerModule.id}`
      : undefined

    if (!(await isAuthTokenValid(req, res, noAuth))) return

    const aesKey = getAESKey(req, res, encrypted, callerModuleId)

    try {
      parseQuery(req, schema.query)

      parseBodyPayload<NonNullable<TMedia>>(
        req,
        (media || {}) as NonNullable<TMedia>,
        encrypted,
        schema.body
      )

      for (const type of ['query', 'body'] as const) {
        await checkRecordExistence({
          type,
          req,
          existenceCheck
        })
      }

      if (isDownloadable) {
        res.setHeader('X-LifeForge-Downloadable', 'true')
        res.setHeader(
          'Access-Control-Expose-Headers',
          'X-LifeForge-Downloadable'
        )
      }

      if (!callback) {
        throw new Error('No callback defined for this controller')
      }

      const result = await callback({
        req: req as any,
        res: res as any,
        io: req.io,
        pb: req.pb,
        body: req.body as any,
        query: req.query as any,
        media: (req.media || {}) as ConvertMedia<NonNullable<TMedia>>,
        core: createCoreContext({
          moduleId: callerModule
            ? `${callerModule.source}:${callerModule.id}`
            : undefined
        })
      })

      if (noDefaultResponse) {
        return
      }

      success(
        res,
        encrypted && aesKey ? (encryptResponse(result, aesKey) as any) : result,
        statusCode
      )
    } catch (err) {
      if (ClientError.isClientError(err)) {
        return clientError({
          res,
          message: err.message,
          code: err.code,
          moduleName: callerModuleId
        })
      }

      serverError(
        res,
        err instanceof Error ? err.message : String(err),
        callerModule ? `${callerModule.source}:${callerModule.id}` : undefined
      )
    }
  }

  // Create handler with metadata attached
  const handlerWithMeta = _handler as typeof _handler & {
    meta: {
      schema: TInput
      description: string
      options: {
        statusCode: number
        noDefaultResponse: boolean
        existenceCheck: any
        isDownloadable: boolean
        encrypted: boolean
      }
    }
  }

  handlerWithMeta.meta = {
    schema,
    description: description as string,
    options: {
      statusCode,
      noDefaultResponse,
      existenceCheck,
      isDownloadable,
      encrypted
    }
  }

  return handlerWithMeta
}

// ============================================================================
// Public Registration Function
// ============================================================================

/**
 * Registers a ForgeControllerBuilder with an Express router.
 * Creates the request handler with all business logic (auth, validation, encryption, error handling)
 * and mounts it on the router with appropriate middlewares.
 *
 * @param controller - The ForgeControllerBuilder instance to register
 * @param router - Express router instance to register the route with
 * @param routeName - The route path name (without leading slash)
 *
 * @example
 * ```typescript
 * const controller = forgeController.mutation()
 *   .input({ body: z.object({ name: z.string() }) })
 *   .callback(async ({ body }) => ({ success: true }))
 *
 * registerController(controller, router, 'users')
 * // Registers POST /users
 * ```
 */
export function registerController<
  TMethod extends 'get' | 'post',
  TInput extends { body?: any; query?: any },
  TOutput,
  TMedia extends MediaConfig | null
>(
  controller: ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia>,
  router: Router,
  routeName: string = ''
): void {
  const config = controller.getValue()

  if (!config.callback) {
    coreLogger.error(
      `Cannot register controller for route "${routeName}": No callback defined.`
    )
    process.exit(1)
  }

  const handler = createHandler<TMethod, TInput, TOutput, TMedia>(config)

  router[config.method](
    `/${routeName}`,
    [
      ...(Object.keys(config.media ?? {}).length > 0
        ? [
            fieldsUploadMiddleware(
              Object.fromEntries(
                Object.entries(config.media ?? ({} as MediaConfig)).map(
                  ([key, value]) => [key, value.multiple ? 999 : 1]
                )
              )
            )
          ]
        : []),
      ...config.middlewares
    ],
    handler
  )
}
