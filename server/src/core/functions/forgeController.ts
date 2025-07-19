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
 *   .schema({
 *     body: z.object({ name: z.string(), email: z.string().email() }),
 *     response: z.object({ id: z.string(), success: z.boolean() })
 *   })
 *   .callback(async ({ body, pb }) => {
 *     const user = await pb.collection('users').create(body)
 *     return { id: user.id, success: true }
 *   })
 *
 * controller.register(router)
 * ```
 */
import { BaseResponse } from '@typescript/base_response'
import { Request, Response } from 'express'
import PocketBase from 'pocketbase'
import { Server } from 'socket.io'
import { ZodObject, ZodRawShape, ZodTypeAny } from 'zod/v4'

import {
  ControllerCallback,
  ControllerSchema,
  InferResponseType,
  InferZodType
} from '../typescript/forge_controller.types'
import ClientError from './ClientError'
import { checkExistence } from './PBRecordValidator'
import { clientError, serverError, successWithBaseResponse } from './response'

/**
 * A fluent builder class for creating type-safe Express.js route controllers with validation.
 * Provides comprehensive schema validation, middleware support, and automatic error handling.
 *
 * @template BodySchema - Zod schema type for request body validation
 * @template QuerySchema - Zod schema type for query parameters validation
 * @template ParamsSchema - Zod schema type for route parameters validation
 * @template ResponseSchema - Zod schema type for response validation
 *
 * @example
 * ```typescript
 * const controller = new ForgeControllerBuilder()
 *   .route('POST /users')
 *   .schema({
 *     body: z.object({ name: z.string() }),
 *     params: z.object({ id: z.string() }),
 *     response: z.object({ success: z.boolean() })
 *   })
 *   .callback(async ({ body, params }) => {
 *     // Handler logic here
 *     return { success: true }
 *   })
 * ```
 */
class ForgeControllerBuilder<
  BodySchema extends ZodObject<ZodRawShape> | undefined = undefined,
  QuerySchema extends ZodObject<ZodRawShape> | undefined = undefined,
  ParamsSchema extends ZodObject<ZodRawShape> | undefined = undefined,
  ResponseSchema extends ZodTypeAny = ZodTypeAny
> {
  /** The HTTP method for this route (get, post, put, patch, delete) */
  protected _method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get'

  /** The URL path for this route */
  protected _path: string = ''

  /** Array of Express middleware functions to apply to this route */
  protected _middlewares: any[] = []

  /** Zod validation schemas for request body, query, params, and response */
  protected _schema: ControllerSchema<
    BodySchema,
    QuerySchema,
    ParamsSchema,
    ResponseSchema
  > = {
    body: undefined,
    query: undefined,
    params: undefined,
    response: undefined!
  }

  /** HTTP status code to return on successful response */
  protected _statusCode = 200

  /** Whether to skip sending the default success response */
  protected _noDefaultResponse = false

  /** Configuration for automatic existence checking of referenced entities */
  protected _existenceCheck: any = {}

  /** Human-readable description of what this endpoint does */
  protected _description = ''

  /** Whether this endpoint returns downloadable content */
  protected _isDownloadable = false

  /** The main request handler function with proper typing for request/response objects */
  private _handler?: (
    this: { pb: PocketBase; io: Server },
    req: Request<
      InferZodType<ParamsSchema>,
      any,
      InferZodType<BodySchema>,
      InferZodType<QuerySchema>
    >,
    res: Response<BaseResponse<InferResponseType<ResponseSchema>>>
  ) => Promise<void>

  /**
   * Creates a new builder instance with updated schema types while preserving current configuration.
   * This is used internally to maintain immutability when chaining methods.
   *
   * @template NewB - New body schema type
   * @template NewQ - New query schema type
   * @template NewP - New params schema type
   * @template NewR - New response schema type
   * @param overrides - Partial schema overrides to apply
   * @returns New builder instance with updated types
   */
  private cloneWith<
    NewB extends ZodObject<ZodRawShape> | undefined = BodySchema,
    NewQ extends ZodObject<ZodRawShape> | undefined = QuerySchema,
    NewP extends ZodObject<ZodRawShape> | undefined = ParamsSchema,
    NewR extends ZodTypeAny = ResponseSchema
  >(overrides: Partial<ControllerSchema<any, any, any, any>>) {
    const builder = new ForgeControllerBuilder<NewB, NewQ, NewP, NewR>()

    builder._method = this._method
    builder._path = this._path
    builder._middlewares = [...this._middlewares]
    builder._schema = { ...this._schema, ...overrides }
    builder._statusCode = this._statusCode
    builder._existenceCheck = this._existenceCheck
    builder._noDefaultResponse = this._noDefaultResponse
    builder._description = this._description

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
    const parts = routeString.split(' ')

    if (parts.length !== 2) {
      throw new Error(
        "Route string must be in the format 'METHOD /path'. Example: 'GET /users'"
      )
    }

    this._method = parts[0].toLowerCase() as
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

    if (!parts[1].startsWith('/')) {
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
   * Sets Zod validation schemas for request body, query parameters, route parameters, and response.
   * This enables automatic validation and type inference for the route handler.
   *
   * @template T - Object containing optional schema definitions
   * @param input - Object with optional body, query, params, and response Zod schemas
   * @returns New builder instance with updated schema types
   *
   * @example
   * ```typescript
   * controller.schema({
   *   body: z.object({ name: z.string(), age: z.number() }),
   *   query: z.object({ page: z.string().optional() }),
   *   params: z.object({ id: z.string() }),
   *   response: z.object({ success: z.boolean(), data: z.any() })
   * })
   * ```
   */
  schema<
    T extends {
      body?: ZodObject<ZodRawShape>
      query?: ZodObject<ZodRawShape>
      params?: ZodObject<ZodRawShape>
      response?: ZodTypeAny
    }
  >(input: T) {
    return this.cloneWith<
      T['body'] extends ZodObject<ZodRawShape> ? T['body'] : BodySchema,
      T['query'] extends ZodObject<ZodRawShape> ? T['query'] : QuerySchema,
      T['params'] extends ZodObject<ZodRawShape> ? T['params'] : ParamsSchema,
      T['response'] extends ZodTypeAny ? T['response'] : ResponseSchema
    >({
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
      ? Partial<Record<keyof InferZodType<BodySchema>, string>>
      : T extends 'query'
        ? Partial<Record<keyof InferZodType<QuerySchema>, string>>
        : T extends 'params'
          ? Partial<Record<keyof InferZodType<ParamsSchema>, string>>
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
   *
   * @param cb - The route handler function that processes the request
   * @returns This builder instance for method chaining
   *
   * @example
   * ```typescript
   * controller.callback(async ({ req, res, body, params, query, pb, io }) => {
   *   // body, params, query are fully typed based on schemas
   *   const user = await pb.collection('users').getOne(params.id)
   *   return { user }
   * })
   * ```
   */
  callback(
    cb: ControllerCallback<
      BodySchema,
      QuerySchema,
      ParamsSchema,
      ResponseSchema
    >
  ) {
    const schema = this._schema

    const options = {
      statusCode: this._statusCode,
      noDefaultResponse: this._noDefaultResponse,
      existenceCheck: this._existenceCheck,
      isDownloadable: this._isDownloadable
    }

    async function __handler(
      this: { pb: PocketBase; io: Server },
      req: Request<
        InferZodType<ParamsSchema>,
        any,
        InferZodType<BodySchema>,
        InferZodType<QuerySchema>
      >,
      res: Response<BaseResponse<InferResponseType<ResponseSchema>>>
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
              req.body = result.data as InferZodType<BodySchema>
            } else if (type === 'query') {
              req.query = result.data as InferZodType<QuerySchema>
            } else if (type === 'params') {
              req.params = result.data as InferZodType<ParamsSchema>
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
                      req as any,
                      res,
                      collection.replace(/\^?\[(.*)\]$/, '$1'),
                      val
                    ))
                  ) {
                    return
                  }
                }
              } else {
                if (
                  !(await checkExistence(
                    req as any,
                    res,
                    collection.replace(/\^?\[(.*)\]$/, '$1'),
                    value!
                  ))
                ) {
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
      }
    }

    __handler.meta = {
      description: this._description,
      schema,
      options
    }

    this._handler = __handler

    return this
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
   * const router = express.Router()
   * controller.register(router)
   * ```
   */
  register(router: import('express').Router) {
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
 * Initial builder class that requires a schema to be set before proceeding.
 * This enforces the pattern where routes must have schemas defined.
 *
 * @template BodySchema - Zod schema type for request body validation
 * @template QuerySchema - Zod schema type for query parameters validation
 * @template ParamsSchema - Zod schema type for route parameters validation
 * @template ResponseSchema - Zod schema type for response validation
 */
class ForgeControllerBuilderWithoutSchema<
  BodySchema extends ZodObject<ZodRawShape> | undefined = undefined,
  QuerySchema extends ZodObject<ZodRawShape> | undefined = undefined,
  ParamsSchema extends ZodObject<ZodRawShape> | undefined = undefined,
  ResponseSchema extends ZodTypeAny = ZodTypeAny
> {
  /** The route string in "METHOD /path" format */
  protected _routeString: string

  /** Human-readable description of what this endpoint does */
  protected _description = ''

  /**
   * Creates a new builder instance that requires schema configuration.
   *
   * @param routeString - Route definition in "METHOD /path" format
   */
  constructor(routeString: string) {
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
   * Sets the validation schemas and transitions to the full builder.
   * This method transforms the initial builder into a fully-featured controller builder.
   *
   * @template T - Object containing optional schema definitions
   * @param input - Object with optional body, query, params, and response Zod schemas
   * @returns New fully-featured builder instance with schema types applied
   *
   * @example
   * ```typescript
   * forgeController
   *   .route('POST /users')
   *   .schema({
   *     body: z.object({ name: z.string() }),
   *     response: z.object({ success: z.boolean() })
   *   })
   *   .callback(async ({ body }) => {
   *     // body is now typed
   *     return { success: true }
   *   })
   * ```
   */
  schema<
    T extends {
      body?: ZodObject<ZodRawShape>
      query?: ZodObject<ZodRawShape>
      params?: ZodObject<ZodRawShape>
      response?: ZodTypeAny
    }
  >(input: T) {
    return new ForgeControllerBuilder<
      T['body'] extends ZodObject<ZodRawShape> ? T['body'] : BodySchema,
      T['query'] extends ZodObject<ZodRawShape> ? T['query'] : QuerySchema,
      T['params'] extends ZodObject<ZodRawShape> ? T['params'] : ParamsSchema,
      T['response'] extends ZodTypeAny ? T['response'] : ResponseSchema
    >()
      .route(this._routeString)
      .description(this._description)
      .schema(input)
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
 *   .schema({
 *     params: z.object({ id: z.string() }),
 *     response: z.object({ user: UserSchema })
 *   })
 *   .existenceCheck('params', { id: 'users' })
 *   .callback(async ({ params, pb }) => {
 *     const user = await pb.collection('users').getOne(params.id)
 *     return { user }
 *   })
 * ```
 */
export const forgeController = {
  /**
   * Creates a new controller builder for the specified route.
   *
   * @template BodySchema - Zod schema type for request body validation
   * @template QuerySchema - Zod schema type for query parameters validation
   * @template ParamsSchema - Zod schema type for route parameters validation
   * @template ResponseSchema - Zod schema type for response validation
   * @param routeString - Route definition in "METHOD /path" format (e.g., "GET /users/:id")
   * @returns New controller builder instance
   */
  route: <
    BodySchema extends ZodObject<ZodRawShape> | undefined = undefined,
    QuerySchema extends ZodObject<ZodRawShape> | undefined = undefined,
    ParamsSchema extends ZodObject<ZodRawShape> | undefined = undefined,
    ResponseSchema extends ZodTypeAny = ZodTypeAny
  >(
    routeString: string
  ) =>
    new ForgeControllerBuilderWithoutSchema<
      BodySchema,
      QuerySchema,
      ParamsSchema,
      ResponseSchema
    >(routeString)
}

/**
 * Utility function to register multiple controllers with an Express router at once.
 * This is useful for organizing and bulk-registering related route controllers.
 *
 * @param router - Express router instance to register controllers with
 * @param controllers - Array of configured controller builders to register
 *
 * @example
 * ```typescript
 * const userControllers = [
 *   getUserController,
 *   createUserController,
 *   updateUserController,
 *   deleteUserController
 * ]
 *
 * bulkRegisterControllers(router, userControllers)
 * ```
 */
export const bulkRegisterControllers = (
  router: import('express').Router,
  controllers: ForgeControllerBuilder<any, any, any, any>[]
) => {
  for (const controller of controllers) {
    controller.register(router)
  }
}
