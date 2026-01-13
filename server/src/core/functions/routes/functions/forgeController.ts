/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Forge Controller - Type-safe Express.js route controller builder
 *
 * This module provides a fluent API for defining Express.js route controllers with:
 * - Full TypeScript type inference for request body, query, and response
 * - Zod schema validation support
 * - File upload configuration
 * - Authentication and encryption options
 * - Existence checking for database records
 *
 * @example
 * ```typescript
 * const controller = forgeController.mutation()
 *   .input({
 *     body: z.object({ name: z.string(), email: z.string().email() })
 *   })
 *   .callback(async ({ body, pb }) => {
 *     const user = await pb.collection('users').create(body)
 *     return { id: user.id, success: true }
 *   })
 * ```
 */
import { getCallerModuleId } from '@functions/utils/getCallerModuleId'

import {
  Context,
  Description,
  InferZodType,
  InputSchema,
  MediaConfig
} from '../typescript/forge_controller.types'

/**
 * A fluent builder class for creating type-safe Express.js route controllers.
 *
 * This class stores all configuration for a route endpoint and provides
 * chainable methods for setting up validation, authentication, file uploads,
 * and the request handler callback.
 *
 * @template TMethod - HTTP method type ('get' | 'post')
 * @template TInput - Input schema containing body and query Zod schemas
 * @template TOutput - The inferred return type from the callback function
 * @template TMedia - Media/file upload configuration type
 *
 * @example
 * ```typescript
 * const controller = forgeController.query()
 *   .input({ query: z.object({ id: z.string() }) })
 *   .existenceCheck('query', { id: 'users' })
 *   .callback(async ({ query, pb }) => {
 *     return await pb.collection('users').getOne(query.id)
 *   })
 * ```
 */
export class ForgeControllerBuilder<
  TMethod extends 'get' | 'post' = 'get',
  TInput extends InputSchema<TMethod> = InputSchema<TMethod>,
  TOutput = unknown,
  TMedia extends MediaConfig | null = null
> {
  /** Marker for runtime type identification */
  public readonly __isForgeController = true as const

  /** Type inference markers (never assigned at runtime, used for TypeScript inference) */
  public __method!: TMethod
  public __input!: TInput
  public __output!: TOutput
  public __media!: TMedia

  /** @internal HTTP method for this route */
  protected _method: TMethod
  /** @internal Array of Express middleware functions */
  protected _middlewares: any[] = []
  /** @internal Zod validation schemas for body and query */
  protected _schema: TInput
  /** @internal HTTP status code for successful responses */
  protected _statusCode: number
  /** @internal Whether to skip the default success response wrapper */
  protected _noDefaultResponse: boolean
  /** @internal Configuration for database record existence validation */
  protected _existenceCheck: {
    body?: Record<keyof InferZodType<TInput['body']>, string>
    query?: Record<keyof InferZodType<TInput['query']>, string>
  }
  /** @internal Human-readable endpoint description */
  protected _description: Description
  /** @internal Whether this endpoint returns downloadable content */
  protected _isDownloadable: boolean
  /** @internal File upload field configuration */
  protected _media: TMedia
  /** @internal Whether to skip authentication */
  protected _noAuth: boolean
  /** @internal Whether to use end-to-end encryption */
  protected _encrypted: boolean
  /** @internal The main request handler callback */
  protected _callback:
    | ((context: Context<TMethod, TInput, TOutput, TMedia>) => Promise<TOutput>)
    | null
  /** @internal Module that defined this controller (for logging) */
  protected _callerModule?: { source: string; id: string }

  /**
   * Creates a new ForgeControllerBuilder instance.
   *
   * @param config - Initial configuration for the controller
   * @internal Use `forgeController.query()` or `forgeController.mutation()` instead
   */
  constructor(config: {
    method: TMethod
    middlewares?: any[]
    schema?: TInput
    statusCode?: number
    noDefaultResponse?: boolean
    existenceCheck?: {
      body?: Record<keyof InferZodType<TInput['body']>, string>
      query?: Record<keyof InferZodType<TInput['query']>, string>
    }
    description?: Description
    isDownloadable?: boolean
    media?: TMedia
    noAuth?: boolean
    encrypted?: boolean
    callback?: (
      context: Context<TMethod, TInput, TOutput, TMedia>
    ) => Promise<TOutput>
    callerModule?: { source: string; id: string }
  }) {
    this._method = config.method
    this._middlewares = config.middlewares ?? []
    this._schema = (config.schema ?? {
      body: undefined,
      query: undefined
    }) as TInput
    this._statusCode = config.statusCode ?? 200
    this._noDefaultResponse = config.noDefaultResponse ?? false
    this._existenceCheck = config.existenceCheck ?? {}
    this._description = config.description ?? ''
    this._isDownloadable = config.isDownloadable ?? false
    this._media = (config.media ?? null) as TMedia
    this._noAuth = config.noAuth ?? false
    this._encrypted = config.encrypted ?? true
    this._callback = config.callback ?? null
    this._callerModule = config.callerModule
  }

  /**
   * Returns all configuration values for this controller.
   * Used by the controller logic to create the Express handler.
   *
   * @returns Object containing all controller configuration
   */
  getValue() {
    return {
      method: this._method,
      middlewares: this._middlewares,
      schema: this._schema,
      statusCode: this._statusCode,
      noDefaultResponse: this._noDefaultResponse,
      existenceCheck: this._existenceCheck,
      description: this._description,
      isDownloadable: this._isDownloadable,
      media: this._media,
      noAuth: this._noAuth,
      encrypted: this._encrypted,
      callback: this._callback,
      callerModule: this._callerModule
    }
  }

  /**
   * Creates a new builder instance with updated configuration.
   * Used internally to maintain immutability when chaining methods.
   *
   * @internal
   */
  private cloneWith<
    NewMethod extends TMethod = TMethod,
    NewInput extends InputSchema<NewMethod> = InputSchema<NewMethod>,
    NewOutput = TOutput,
    NewMedia extends MediaConfig | null = TMedia
  >(
    overrides: Partial<{
      method: NewMethod
      middlewares: any[]
      schema: NewInput
      statusCode: number
      noDefaultResponse: boolean
      existenceCheck: {
        body?: Record<keyof InferZodType<NewInput['body']>, string>
        query?: Record<keyof InferZodType<NewInput['query']>, string>
      }
      description: Description
      isDownloadable: boolean
      media: NewMedia
      noAuth: boolean
      encrypted: boolean
      callback: (
        context: Context<NewMethod, NewInput, NewOutput, NewMedia>
      ) => Promise<NewOutput>
    }>
  ): ForgeControllerBuilder<NewMethod, NewInput, NewOutput, NewMedia> {
    return new ForgeControllerBuilder<NewMethod, NewInput, NewOutput, NewMedia>(
      {
        method: (overrides.method ?? this._method) as NewMethod,
        middlewares: overrides.middlewares ?? [...this._middlewares],
        schema: (overrides.schema ?? this._schema) as unknown as NewInput,
        statusCode: overrides.statusCode ?? this._statusCode,
        noDefaultResponse:
          overrides.noDefaultResponse ?? this._noDefaultResponse,
        existenceCheck: overrides.existenceCheck ?? { ...this._existenceCheck },
        description: overrides.description ?? this._description,
        isDownloadable: overrides.isDownloadable ?? this._isDownloadable,
        media: (overrides.media ?? this._media) as NewMedia,
        noAuth: overrides.noAuth ?? this._noAuth,
        encrypted: overrides.encrypted ?? this._encrypted,
        callback: overrides.callback ?? (this._callback as any),
        callerModule: this._callerModule
      }
    )
  }

  /**
   * Adds Express middleware functions to be executed before the handler.
   * Middlewares are executed in the order they are added.
   *
   * @param middlewares - One or more Express middleware functions
   * @returns New builder instance with added middlewares
   *
   * @example
   * ```typescript
   * controller.middlewares(rateLimiter, customValidator)
   * ```
   */
  middlewares(
    ...middlewares: any[]
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      middlewares: [...this._middlewares, ...middlewares]
    })
  }

  /**
   * Configures file upload fields for this endpoint.
   * Automatically sets up multer middleware for handling multipart/form-data.
   *
   * @template NewMedia - The media configuration type
   * @param config - Object defining upload fields and their options
   * @returns New builder instance with media configuration
   *
   * @example
   * ```typescript
   * controller.media({
   *   avatar: { optional: false },
   *   attachments: { multiple: true, optional: true }
   * })
   * ```
   */
  media<NewMedia extends MediaConfig>(
    config: NewMedia
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, NewMedia> {
    return this.cloneWith<TMethod, TInput, TOutput, NewMedia>({
      media: config
    })
  }

  /**
   * Sets Zod validation schemas for request body and/or query parameters.
   * Enables automatic validation and full TypeScript type inference.
   *
   * @template T - The input schema type
   * @param schema - Object with optional `body` and `query` Zod schemas
   * @returns New builder instance with updated input types
   *
   * @example
   * ```typescript
   * controller.input({
   *   body: z.object({ name: z.string(), age: z.number() }),
   *   query: z.object({ includeDeleted: z.string().optional() })
   * })
   * ```
   */
  input<T extends InputSchema<TMethod>>(
    schema: T
  ): ForgeControllerBuilder<TMethod, T, TOutput, TMedia> {
    return this.cloneWith<TMethod, T, TOutput, TMedia>({
      schema: { ...this._schema, ...schema } as unknown as T
    })
  }

  /**
   * Sets the HTTP status code for successful responses.
   *
   * @param code - HTTP status code (e.g., 200, 201, 204)
   * @returns New builder instance with updated status code
   *
   * @example
   * ```typescript
   * controller.statusCode(201) // For created resources
   * ```
   */
  statusCode(
    code: number
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ statusCode: code })
  }

  /**
   * Disables the automatic success response wrapper.
   * Use when you need full control over the response (e.g., streaming, custom headers).
   *
   * @returns New builder instance with noDefaultResponse enabled
   *
   * @example
   * ```typescript
   * controller
   *   .noDefaultResponse()
   *   .callback(async ({ res }) => {
   *     res.json({ custom: 'response' })
   *   })
   * ```
   */
  noDefaultResponse(): ForgeControllerBuilder<
    TMethod,
    TInput,
    TOutput,
    TMedia
  > {
    return this.cloneWith({ noDefaultResponse: true })
  }

  /**
   * Configures automatic database record existence validation.
   * Specified fields will be checked against their collections before the handler runs.
   *
   * @template T - The request section to validate ('body' | 'query')
   * @param type - Which part of the request contains the IDs to check
   * @param map - Mapping of field names to collection names
   * @returns New builder instance with existence check configuration
   *
   * @example
   * ```typescript
   * // Required field - throws error if not found
   * controller.existenceCheck('body', { userId: 'users' })
   *
   * // Optional field - only checks if value is provided (wrap in brackets)
   * controller.existenceCheck('query', { categoryId: '[categories]' })
   * ```
   */
  existenceCheck<T extends 'body' | 'query'>(
    type: T,
    map: Partial<Record<keyof InferZodType<TInput[T]>, string>>
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      existenceCheck: {
        ...this._existenceCheck,
        [type]: map
      }
    })
  }

  /**
   * Sets a human-readable description for this endpoint.
   * Can be used for API documentation generation.
   *
   * @param desc - Description text or localized description object
   * @returns New builder instance with description
   *
   * @example
   * ```typescript
   * controller.description('Creates a new user account')
   * ```
   */
  description(
    desc: Description
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ description: desc })
  }

  /**
   * Disables authentication requirement for this endpoint.
   * Use for public endpoints that don't require a logged-in user.
   *
   * @returns New builder instance with authentication disabled
   *
   * @example
   * ```typescript
   * controller.noAuth().callback(async () => ({ status: 'ok' }))
   * ```
   */
  noAuth(): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ noAuth: true })
  }

  /**
   * Disables end-to-end encryption for this endpoint.
   * By default, all endpoints use RSA + AES hybrid encryption.
   *
   * Use for endpoints that:
   * - Return public information
   * - Return binary/file data
   * - Need maximum performance for non-sensitive data
   *
   * @returns New builder instance with encryption disabled
   *
   * @example
   * ```typescript
   * controller.noEncryption().callback(async () => ({ public: 'data' }))
   * ```
   */
  noEncryption(): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ encrypted: false })
  }

  /**
   * Marks this endpoint as returning downloadable content.
   * Sets appropriate headers and disables the default response wrapper.
   *
   * @returns New builder instance configured for downloads
   *
   * @example
   * ```typescript
   * controller
   *   .isDownloadable()
   *   .callback(async ({ res }) => {
   *     res.setHeader('Content-Disposition', 'attachment; filename="export.csv"')
   *     res.send(csvData)
   *   })
   * ```
   */
  isDownloadable(): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      isDownloadable: true,
      noDefaultResponse: true,
      statusCode: 200
    })
  }

  /**
   * Sets the main request handler callback.
   * The callback receives a typed context with validated body, query, and utilities.
   * The return type is automatically inferred for the response.
   *
   * @template CB - The callback function type
   * @param cb - Async function that handles the request
   * @returns New builder instance with inferred output type
   *
   * @example
   * ```typescript
   * controller
   *   .input({ body: z.object({ name: z.string() }) })
   *   .callback(async ({ body, pb, io }) => {
   *     const user = await pb.collection('users').create(body)
   *     io.emit('userCreated', user)
   *     return { success: true, id: user.id }
   *   })
   * ```
   */
  callback<
    CB extends (context: Context<TMethod, TInput, any, TMedia>) => Promise<any>
  >(
    cb: CB
  ): ForgeControllerBuilder<TMethod, TInput, Awaited<ReturnType<CB>>, TMedia> {
    this._callerModule = getCallerModuleId()

    return this.cloneWith<TMethod, TInput, Awaited<ReturnType<CB>>, TMedia>({
      callback: cb as any
    })
  }
}

/**
 * Initial builder class for routes without schema defined yet.
 * Provides methods that can be called before `.input()`.
 *
 * @template TMethod - HTTP method type ('get' | 'post')
 * @internal Use `forgeController.query()` or `forgeController.mutation()` instead
 */
class ForgeControllerBuilderWithoutSchema<
  TMethod extends 'get' | 'post' = 'get'
> {
  protected _method: TMethod
  protected _description: Description = ''
  protected _noAuth: boolean = false
  protected _encrypted: boolean = true

  constructor(method: TMethod) {
    this._method = method
  }

  /**
   * Sets a description before defining the input schema.
   * @see ForgeControllerBuilder.description
   */
  description(desc: Description): this {
    this._description = desc

    return this
  }

  /**
   * Disables authentication before defining the input schema.
   * @see ForgeControllerBuilder.noAuth
   */
  noAuth(): this {
    this._noAuth = true

    return this
  }

  /**
   * Disables encryption before defining the input schema.
   * @see ForgeControllerBuilder.noEncryption
   */
  noEncryption(): this {
    this._encrypted = false

    return this
  }

  /**
   * Sets the input validation schema and transitions to the full builder.
   * @see ForgeControllerBuilder.input
   */
  input<T extends InputSchema<TMethod>>(
    schema: T
  ): ForgeControllerBuilder<TMethod, T, unknown, null> {
    return new ForgeControllerBuilder<TMethod, T, unknown, null>({
      method: this._method,
      schema,
      description: this._description,
      noAuth: this._noAuth,
      encrypted: this._encrypted
    })
  }
}

/**
 * Factory object for creating route controller builders.
 *
 * @example
 * ```typescript
 * // GET request
 * const getUsers = forgeController.query()
 *   .input({ query: z.object({ limit: z.string().optional() }) })
 *   .callback(async ({ query, pb }) => {
 *     return await pb.collection('users').getList(1, Number(query.limit) || 10)
 *   })
 *
 * // POST request
 * const createUser = forgeController.mutation()
 *   .input({ body: z.object({ name: z.string(), email: z.string() }) })
 *   .callback(async ({ body, pb }) => {
 *     return await pb.collection('users').create(body)
 *   })
 * ```
 */
const forgeController = {
  /**
   * Creates a new GET request controller builder.
   * @returns A new ForgeControllerBuilderWithoutSchema for GET requests
   */
  query: () => new ForgeControllerBuilderWithoutSchema('get'),

  /**
   * Creates a new POST request controller builder.
   * @returns A new ForgeControllerBuilderWithoutSchema for POST requests
   */
  mutation: () => new ForgeControllerBuilderWithoutSchema('post')
}

export default forgeController
