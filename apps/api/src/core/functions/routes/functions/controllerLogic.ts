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
import { encryptResponse } from '@functions/encryption'
import { coreLogger } from '@functions/logging'
import type { Request, Response, Router } from 'express'

import {
  BaseResponse,
  ForgeContract,
  MediaConfig,
  getStatusMessage
} from '@lifeforge/server-utils'

import checkRecordExistence from '../utils/checkRecordExistence'
import { createCoreContext } from '../utils/coreContext'
import getAESKey from '../utils/getAESKey'
import parseBodyPayload from '../utils/parsePayload'
import parseQuery from '../utils/parseQuery'
import { clientError, serverError, success } from '../utils/response'
import fieldsUploadMiddleware from '../utils/uploadMiddleware'
import isAuthTokenValid from '../utils/validateAuthToken'

function isClientError(err: unknown): err is Error & { code: number } {
  return err instanceof Error && err.name === 'ClientError' && 'code' in err
}

/**
 * Creates an Express request handler from a ForgeControllerBuilder's configuration.
 * This is kept private and only used internally by registerController.
 */
function createHandler(
  config: ReturnType<ForgeContract['getValue']>
): (req: Request, res: Response<BaseResponse<unknown>>) => Promise<void> {
  const {
    schema: input,
    noDefaultResponse,
    existenceCheck,
    isDownloadable,
    media,
    noAuth,
    encrypted,
    callback,
    callerModule,
    output
  } = config

  return async (req: Request, res: Response<BaseResponse<unknown>>) => {
    const callerModuleId = callerModule
      ? `${callerModule.source}:${callerModule.id}`
      : undefined

    if (!(await isAuthTokenValid(req, res, noAuth))) return

    const aesKey = getAESKey(req, res, encrypted, callerModuleId)

    try {
      parseQuery(req, input.query)

      parseBodyPayload(req, (media || {}) as MediaConfig, encrypted, input.body)

      for (const type of ['query', 'body'] as const) {
        await checkRecordExistence({
          type,
          req,
          existenceCheck,
          module: callerModule || { id: '' }
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
        req,
        res,
        io: req.io,
        pb: req.pb(callerModule || { id: '' }),
        body: req.body,
        query: req.query,
        media: req.media || {},
        core: createCoreContext({
          pb: req.pb(callerModule || { id: '' }),
          module: callerModule as never
        })
      })

      if (res.headersSent) {
        return
      }

      if (noDefaultResponse || output === 'custom') {
        return
      }

      const status = result?.$status ?? 200

      const payload =
        result && typeof result === 'object' && '$status' in result
          ? result.payload
          : result

      if (status >= 400) {
        return clientError({
          res,
          message: payload ?? getStatusMessage(status),
          code: status,
          moduleName: callerModuleId
        })
      }

      success(
        res,
        encrypted && aesKey
          ? (encryptResponse(payload, aesKey) as unknown)
          : payload,
        status
      )
    } catch (err) {
      if (isClientError(err)) {
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
}

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
 * const controller = forgeContract.mutation()
 *   .input({ body: z.object({ name: z.string() }) })
 *   .callback(async ({ body }) => ({ success: true }))
 *
 * registerController(controller, router, 'users')
 * // Registers POST /users
 * ```
 */
export function registerController(
  controller: ForgeContract,
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

  const handler = createHandler(config)

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
