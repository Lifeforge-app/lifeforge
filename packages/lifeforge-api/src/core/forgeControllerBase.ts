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
import type { Request, Response } from 'express'
import type {
  ZodIntersection,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
  z
} from 'zod/v4'

export interface BaseResponse<T = ''> {
  data?: T
  state: 'success' | 'error' | 'accepted'
  message?: string
}

export type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InputSchema = {
  body?: ZodObjectOrIntersection
  query?: ZodObjectOrIntersection
  params?: ZodObjectOrIntersection
}

type InferZodType<T> = T extends ZodObject<ZodRawShape> ? z.infer<T> : object

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
export class ForgeControllerBuilderBase<
  TRoute extends string = string,
  TInput extends InputSchema = InputSchema,
  TOutput = unknown
> {
  public routeString: TRoute = '' as TRoute
  /** The HTTP method for this route (get, post, put, patch, delete) */
  protected _method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get'

  /** The URL path for this route */
  protected _path: string = ''

  /** Array of Express middleware functions to apply to this route */
  protected _middlewares: any[] = []

  /** Zod validation schemas for request body, query, and params */
  protected _schema: TInput = {
    body: undefined,
    query: undefined,
    params: undefined
  } as TInput

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
  protected _handler?: (
    req: Request<
      InferZodType<TInput['params']>,
      any,
      InferZodType<TInput['body']>,
      InferZodType<TInput['query']>
    >,
    res: Response<BaseResponse<any>>
  ) => Promise<void>

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
    const builder = new ForgeControllerBuilderBase<
      NewRoute,
      NewInput,
      NewOutput
    >()

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
}
