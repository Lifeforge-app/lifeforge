/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Forge Controller - Type-safe Express.js route controller builder
 *
 * This module provides a fluent API for creating Express.js route controllers with:
 * - Automatic request/response validation using Zod schemas
 * - Type-safe request handlers with full TypeScript inference
 * - Built-in error handling and standardized responses
 * - Middleware support and existence checking for referenced entities
 * - Support for downloadable content and custom response handling
 *
 * The main exports are:
 * - `forgeController`: Factory for creating new controller builders
 * - `bulkRegisterControllers`: Utility for registering multiple controllers
 *
 * @example
 * ```typescript
 * const controller = forgeController
 *   .route('POST /users')
 *   .input({
 *     body: z.object({ name: z.string(), email: z.string().email() })
 *   })
 *   .callback(async ({ body, pb }) => {
 *     const user = await pb.collection('users').create(body)
 *     return { id: user.id, success: true }
 *   })
 * // controller now has OutputType = { id: string, success: boolean }
 * type ControllerOutput = InferControllerOutput<typeof controller>
 *
 * controller.register(router)
 * ```
 */
import { PBService, checkExistence } from '@functions/database'
import COLLECTION_SCHEMAS from '@schema'
import type { BaseResponse } from '@typescript/base_response'
import type { Request, Response, Router } from 'express'
import { ForgeControllerBuilderBase } from 'lifeforge-api'
import type { Server } from 'socket.io'
import { z } from 'zod/v4'
import type {
  ZodIntersection,
  ZodObject,
  ZodRawShape,
  ZodTypeAny
} from 'zod/v4'

import {
  ClientError,
  clientError,
  serverError,
  successWithBaseResponse
} from '../utils/response'

export type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InputSchema = {
  body?: ZodObjectOrIntersection
  query?: ZodObjectOrIntersection
  params?: ZodObjectOrIntersection
}

type InferZodType<T> = T extends ZodObject<ZodRawShape> ? z.infer<T> : object

type Context<TInput extends InputSchema, TOutput = unknown> = {
  req: Request<
    InferZodType<TInput['params']>,
    BaseResponse<TOutput>,
    InferZodType<TInput['body']>,
    InferZodType<TInput['query']>
  >
  res: Response<BaseResponse<TOutput>>
  io: Server
  pb: PBService
  params: InferZodType<TInput['params']>
  body: InferZodType<TInput['body']>
  query: InferZodType<TInput['query']>
}

/**
 * A fluent builder class for creating type-safe Express.js route controllers with validation.
 * Provides comprehensive schema validation, middleware support, and automatic error handling.
 *
 * @template TInput - InputSchema containing body, query, and params validation schemas
 * @template TOutput - The inferred return type from the callback function
 *
 * @example
 * ```typescript
 * const controller = new ForgeControllerBuilder()
 *   .route('POST /users')
 *   .input({
 *     body: z.object({ name: z.string() }),
 *     params: z.object({ id: z.string() })
 *   })
 *   .callback(async ({ body, params }) => {
 *     // Handler logic here
 *     return { success: true }
 *   })
 * ```
 */
export class ForgeControllerBuilder<
  TRoute extends string = string,
  TInput extends InputSchema = InputSchema,
  TOutput = unknown
> extends ForgeControllerBuilderBase<TRoute, TInput, TOutput> {
  /**
   * Sets the main request handler function with comprehensive error handling and validation.
   * The callback receives validated and typed request data along with response utilities.
   * The return type is automatically inferred and made available as a generic parameter.
   *
   * @param cb - The route handler function that processes the request
   * @returns New builder instance with inferred output type
   *
   * @example
   * ```typescript
   * const controller = controller.callback(async ({ req, res, body, params, query, pb, io }) => {
   *   // body, params, query are fully typed based on input schemas
   *   const user = await pb.collection('users').getOne(params.id)
   *   return { success: true, user } // Return type is automatically inferred and captured
   * })
   * // controller now has the return type { success: boolean, user: User } as OutputType
   * ```
   */
  callback<CB extends (context: Context<TInput, any>) => Promise<any>>(
    cb: CB
  ): ForgeControllerBuilder<TRoute, TInput, Awaited<ReturnType<CB>>> {
    const schema = this._schema

    const options = {
      statusCode: this._statusCode,
      noDefaultResponse: this._noDefaultResponse,
      existenceCheck: this._existenceCheck,
      isDownloadable: this._isDownloadable
    }

    async function __handler(
      req: Request<
        InferZodType<TInput['params']>,
        any,
        InferZodType<TInput['body']>,
        InferZodType<TInput['query']>
      >,
      res: Response<BaseResponse<Awaited<ReturnType<CB>>>>
    ): Promise<void> {
      try {
        for (const type of ['body', 'query', 'params'] as const) {
          const validator = schema[type]

          if (validator) {
            const result = validator.safeParse(req[type])

            if (!result.success) {
              return clientError(res, {
                location: type,
                message: JSON.parse(result.error.message)
              })
            }

            if (type === 'body') {
              req.body = result.data as InferZodType<TInput['body']>
            } else if (type === 'query') {
              req.query = result.data as InferZodType<TInput['query']>
            } else if (type === 'params') {
              req.params = result.data as InferZodType<TInput['params']>
            }
          }

          if (options.existenceCheck?.[type]) {
            for (const [key, collection] of Object.entries(
              options.existenceCheck[type]
            ) as Array<[string, string]>) {
              const optional = collection.match(/\^?\[(.*)\]$/)

              const value = (req[type] as any)[key] as
                | string
                | string[]
                | undefined

              if (optional && !value) continue

              if (Array.isArray(value)) {
                for (const val of value) {
                  if (
                    !(await checkExistence(
                      req.pb,
                      collection.replace(
                        /\^?\[(.*)\]$/,
                        '$1'
                      ) as unknown as keyof typeof COLLECTION_SCHEMAS,
                      val
                    ))
                  ) {
                    clientError(
                      res,
                      `Invalid ${type} field "${key}" with value "${val}" does not exist in collection "${collection}"`
                    )

                    return
                  }
                }
              } else {
                if (
                  !(await checkExistence(
                    req.pb,
                    collection.replace(
                      /\^?\[(.*)\]$/,
                      '$1'
                    ) as unknown as keyof typeof COLLECTION_SCHEMAS,
                    value!
                  ))
                ) {
                  clientError(
                    res,
                    `Invalid ${type} field "${key}" with value "${value}" does not exist in collection "${collection}"`
                  )

                  return
                }
              }
            }
          }
        }

        if (options.isDownloadable) {
          res.setHeader('X-Lifeforge-Downloadable', 'true')
          res.setHeader(
            'Access-Control-Expose-Headers',
            'X-Lifeforge-Downloadable'
          )
        }

        const result = await cb({
          req,
          res,
          io: req.io,
          pb: req.pb,
          params: req.params,
          body: req.body,
          query: req.query
        })

        if (!options.noDefaultResponse) {
          res.status(options.statusCode || 200)
          successWithBaseResponse(res, result)
        }
      } catch (err) {
        if (ClientError.isClientError(err)) {
          return clientError(res, err.message, err.code)
        }
        console.error(
          'Internal error:',
          err instanceof Error ? err.message : err
        )
        serverError(res, 'Internal server error')
        throw err
      }
    }

    __handler.meta = {
      description: this._description,
      schema,
      options
    }

    this._handler = __handler

    // Create a new builder instance with the inferred return type
    const newBuilder = new ForgeControllerBuilder<
      TRoute,
      TInput,
      Awaited<ReturnType<CB>>
    >()

    newBuilder._method = this._method
    newBuilder._path = this._path
    newBuilder._middlewares = [...this._middlewares]
    newBuilder._schema = this._schema
    newBuilder._statusCode = this._statusCode
    newBuilder._existenceCheck = this._existenceCheck
    newBuilder._noDefaultResponse = this._noDefaultResponse
    newBuilder._description = this._description
    newBuilder._isDownloadable = this._isDownloadable
    newBuilder._handler = __handler

    return newBuilder
  }

  /**
   * Registers this controller with an Express router.
   * This must be called after setting up the route, schema, and callback.
   *
   * @param router - Express router instance to register the route with
   * @throws {Error} When path, method, or handler are missing
   *
   * @example
   * ```typescript
   * import forgeRouter from '@functions/forgeRouter'
   * controller.register(router)
   * ```
   */
  register(router: Router) {
    if (!this._path || !this._method) {
      throw new Error('Missing path or method. Use route() before register()')
    }

    if (!this._handler) {
      throw new Error('Missing handler. Use .callback() before .register()')
    }

    router[this._method](this._path, ...this._middlewares, this._handler)
  }
}

/**
 * Initial builder class that requires input schemas to be set before proceeding.
 * This enforces the pattern where routes must have input validation defined.
 */
class ForgeControllerBuilderWithoutSchema<TRoute extends string = string> {
  /** The route string in "METHOD /path" format */
  protected _routeString: TRoute

  /** Human-readable description of what this endpoint does */
  protected _description = ''

  /**
   * Creates a new builder instance that requires schema configuration.
   *
   * @param routeString - Route definition in "METHOD /path" format
   */
  constructor(routeString: TRoute) {
    this._routeString = routeString
  }

  /**
   * Sets a description for this endpoint before schema configuration.
   *
   * @param desc - Descriptive text explaining what this endpoint does
   * @returns This builder instance for method chaining
   */
  description(desc: string) {
    this._description = desc

    return this
  }

  /**
   * Sets the input validation schemas and transitions to the full builder.
   * This method transforms the initial builder into a fully-featured controller builder.
   *
   * @template T - Object containing optional input schema definitions
   * @param input - Object with optional body, query, and params Zod schemas
   * @returns New fully-featured builder instance with input schema types applied
   *
   * @example
   * ```typescript
   * forgeController
   *   .route('POST /users')
   *   .input({
   *     body: z.object({ name: z.string() }),
   *     params: z.object({ id: z.string() })
   *   })
   *   .callback(async ({ body }) => {
   *     // body is now typed
   *     return { success: true }
   *   })
   * ```
   */
  input<T extends InputSchema>(input: T) {
    return new ForgeControllerBuilder<TRoute, T, unknown>()
      .input(input)
      .route(this._routeString)
      .description(this._description) as ForgeControllerBuilder<
      TRoute,
      T,
      unknown
    >
  }
}

/**
 * Main factory object for creating type-safe route controllers.
 * Provides a fluent API for building Express route handlers with validation.
 *
 * @example
 * ```typescript
 * const getUserController = forgeController
 *   .route('GET /users/:id')
 *   .description('Retrieves a single user by ID')
 *   .input({
 *     params: z.object({ id: z.string() })
 *   })
 *   .existenceCheck('params', { id: 'users' })
 *   .callback(async ({ params, pb }) => {
 *     const user = await pb.collection('users').getOne(params.id)
 *     return { user }
 *   })
 * // getUserController now has OutputType = { user: User }
 * type UserOutput = InferControllerOutput<typeof getUserController>
 * ```
 */
const forgeController = {
  /**
   * Creates a new controller builder for the specified route.
   *
   * @template TInput - InputSchema containing body, query, and params validation schemas
   * @template TOutput - The inferred return type from the callback function
   * @param routeString - Route definition in "METHOD /path" format (e.g., "GET /users/:id")
   * @returns New controller builder instance
   */
  route: <TRoute extends string>(routeString: TRoute) =>
    new ForgeControllerBuilderWithoutSchema(routeString)
}

export default forgeController
