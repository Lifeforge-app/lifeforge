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
import { ForgeAPIServerControllerBase } from 'lifeforge-api'
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
> extends ForgeAPIServerControllerBase<TRoute, TInput, TOutput> {
  /**
   * Creates a new builder instance with updated schema types while preserving current configuration.
   * This is used internally to maintain immutability when chaining methods.
   *
   * @template NewInput - New input schema type
   * @template NewOutput - New output type
   * @param overrides - Partial schema overrides to apply
   * @returns New builder instance with updated types
   */
  private cloneWith<
    NewRoute extends string = TRoute,
    NewInput extends InputSchema = TInput,
    NewOutput = TOutput
  >(overrides: Partial<InputSchema>) {
    const builder = new ForgeControllerBuilder<NewRoute, NewInput, NewOutput>()

    builder._method = this._method
    builder._path = this._path
    builder._middlewares = [...this._middlewares]
    builder._schema = { ...this._schema, ...overrides } as unknown as NewInput
    builder._statusCode = this._statusCode
    builder._existenceCheck = this._existenceCheck
    builder._noDefaultResponse = this._noDefaultResponse
    builder._description = this._description
    builder._isDownloadable = this._isDownloadable

    return builder
  }

  /**
   * Sets the HTTP method and path for this route controller.
   *
   * @param routeString - Route definition in format "METHOD /path" (e.g., "GET /users" or "POST /users/:id")
   * @returns This builder instance for method chaining
   * @throws {Error} When route string format is invalid or method is not supported
   *
   * @example
   * ```typescript
   * controller.route('GET /users/:id')
   * controller.route('POST /users')
   * ```
   */
  route(routeString: string) {
    this.routeString = routeString as TRoute

    const parts = routeString.split(' ')

    if (parts.length !== 2) {
      throw new Error(
        "Route string must be in the format 'METHOD /path'. Example: 'GET /users'"
      )
    }

    this._method = parts[0]?.toLowerCase() as
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete'

    if (!['get', 'post', 'put', 'patch', 'delete'].includes(this._method)) {
      throw new Error(
        `Invalid method: ${this._method}. Must be one of: get, post, put, patch, delete.`
      )
    }

    if (!parts[1]?.startsWith('/')) {
      throw new Error(
        `Path must start with a slash. Given: ${this._path}. Example: '/users'`
      )
    }

    this._path = parts[1]

    return this
  }

  /**
   * Adds Express middleware functions to be executed before the main route handler.
   * Middleware functions are executed in the order they are added.
   *
   * @param middlewares - One or more Express middleware functions
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * controller.middlewares(authMiddleware, validationMiddleware)
   * ```
   */
  middlewares(...middlewares: any[]) {
    this._middlewares.push(...middlewares)

    return this
  }

  /**
   * Sets Zod validation schemas for request input (body, query parameters, and route parameters).
   * This enables automatic validation and type inference for the route handler.
   *
   * @template T - Object containing optional input schema definitions
   * @param input - Object with optional body, query, and params Zod schemas
   * @returns New builder instance with updated input schema types
   *
   * @example
   * ```typescript
   * controller.input({
   *   body: z.object({ name: z.string(), age: z.number() }),
   *   query: z.object({ page: z.string().optional() }),
   *   params: z.object({ id: z.string() })
   * })
   * ```
   */
  input<T extends InputSchema>(input: T) {
    return this.cloneWith<TRoute, T, TOutput>({
      ...input
    })
  }

  /**
   * Sets the HTTP status code to return on successful response.
   *
   * @param code - HTTP status code (e.g., 200, 201, 204)
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * controller.statusCode(201) // For created resources
   * controller.statusCode(204) // For no content responses
   * ```
   */
  statusCode(code: number) {
    this._statusCode = code

    return this
  }

  /**
   * Disables the automatic success response wrapper.
   * Use this when you need full control over the response format or for streaming responses.
   *
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * controller
   *   .noDefaultResponse()
   *   .callback(({ res }) => {
   *     res.json({ custom: 'response' }) // Manual response handling
   *   })
   * ```
   */
  noDefaultResponse() {
    this._noDefaultResponse = true

    return this
  }

  /**
   * Configures automatic existence validation for referenced entities in request data.
   * Before the main handler executes, specified fields will be checked against database collections.
   *
   * @template T - The request section to validate ('params' | 'body' | 'query')
   * @param type - Which part of the request to validate
   * @param map - Mapping of field names to collection names for existence checking
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * // Check if user exists when userId is provided in request body
   * controller.existenceCheck('body', { userId: 'users' })
   *
   * // Check optional fields (wrapped in brackets)
   * controller.existenceCheck('query', { categoryId: '[categories]' })
   *
   * // Check arrays of IDs
   * controller.existenceCheck('body', { tagIds: 'tags' })
   * ```
   */
  existenceCheck<T extends 'params' | 'body' | 'query'>(
    type: T,
    map: T extends 'body'
      ? Partial<Record<keyof InferZodType<TInput['body']>, string>>
      : T extends 'query'
        ? Partial<Record<keyof InferZodType<TInput['query']>, string>>
        : T extends 'params'
          ? Partial<Record<keyof InferZodType<TInput['params']>, string>>
          : never
  ) {
    this._existenceCheck[type] = map

    return this
  }

  /**
   * Sets a human-readable description for this endpoint.
   * This description can be used for API documentation generation.
   *
   * @param desc - Descriptive text explaining what this endpoint does
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * controller.description('Creates a new user account with email verification')
   * ```
   */
  description(desc: string) {
    this._description = desc

    return this
  }

  /**
   * Marks this endpoint as returning downloadable content.
   * Sets appropriate headers and disables the default response wrapper.
   * Automatically sets status code to 200 and enables noDefaultResponse.
   *
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * controller
   *   .isDownloadable()
   *   .callback(({ res }) => {
   *     res.setHeader('Content-Disposition', 'attachment; filename="export.csv"')
   *     res.send(csvData)
   *   })
   * ```
   */
  isDownloadable() {
    this._isDownloadable = true
    this._noDefaultResponse = true
    this._statusCode = 200

    return this
  }

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
