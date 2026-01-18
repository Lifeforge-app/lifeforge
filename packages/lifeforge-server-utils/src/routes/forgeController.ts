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
import { CleanedSchemas, CollectionKey } from '@lifeforge/server-utils'

import { getCallerModuleId } from '..'
import {
  Context,
  InferZodType,
  InputSchema,
  MediaConfig
} from '../typescript/forge_controller.types'

export function snakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s\-]+/g, '_')
    .toLowerCase()
}

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
export class Forge<
  TSchemas extends CleanedSchemas,
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

  /** @internal All available collection schemas */
  #schemas: TSchemas
  /** @internal HTTP method for this route */
  #method: TMethod
  /** @internal Array of Express middleware functions */
  #middlewares: any[] = []
  /** @internal Zod validation schemas for body and query */
  #inputSchema: TInput
  /** @internal HTTP status code for successful responses */
  #statusCode: number
  /** @internal Whether to skip the default success response wrapper */
  #noDefaultResponse: boolean
  /** @internal Configuration for database record existence validation */
  #existenceCheck: {
    body?: Record<keyof InferZodType<TInput['body']>, string>
    query?: Record<keyof InferZodType<TInput['query']>, string>
  }
  /** @internal Human-readable endpoint description */
  #description: string
  /** @internal Whether this endpoint returns downloadable content */
  #isDownloadable: boolean
  /** @internal File upload field configuration */
  #media: TMedia
  /** @internal Whether to skip authentication */
  #noAuth: boolean
  /** @internal Whether to use end-to-end encryption */
  #encrypted: boolean
  /** @internal The main request handler callback */
  #callback:
    | ((
        context: Context<TSchemas, TMethod, TInput, TOutput, TMedia>
      ) => Promise<TOutput>)
    | null
  /** @internal Module that defined this controller (for logging) */
  #callerModule?: { source: string; id: string }

  /**
   * Creates a new ForgeControllerBuilder instance.
   *
   * @param config - Initial configuration for the controller
   * @internal Use `forgeController.query()` or `forgeController.mutation()` instead
   */
  constructor(config: {
    schemas: TSchemas
    method: TMethod
    middlewares?: any[]
    inputSchema?: TInput
    statusCode?: number
    noDefaultResponse?: boolean
    existenceCheck?: {
      body?: Record<keyof InferZodType<TInput['body']>, string>
      query?: Record<keyof InferZodType<TInput['query']>, string>
    }
    description?: string
    isDownloadable?: boolean
    media?: TMedia
    noAuth?: boolean
    encrypted?: boolean
    callback?: (
      context: Context<TSchemas, TMethod, TInput, TOutput, TMedia>
    ) => Promise<TOutput>
    callerModule?: { source: string; id: string }
  }) {
    this.#schemas = config.schemas
    this.#method = config.method
    this.#middlewares = config.middlewares ?? []
    this.#inputSchema = (config.inputSchema ?? {
      body: undefined,
      query: undefined
    }) as TInput
    this.#statusCode = config.statusCode ?? 200
    this.#noDefaultResponse = config.noDefaultResponse ?? false
    this.#existenceCheck = config.existenceCheck ?? {}
    this.#description = config.description ?? ''
    this.#isDownloadable = config.isDownloadable ?? false
    this.#media = (config.media ?? null) as TMedia
    this.#noAuth = config.noAuth ?? false
    this.#encrypted = config.encrypted ?? true
    this.#callback = config.callback ?? null
    this.#callerModule = config.callerModule
  }

  /**
   * Returns all configuration values for this controller.
   * Used by the controller logic to create the Express handler.
   *
   * @returns Object containing all controller configuration
   */
  getValue() {
    return {
      method: this.#method,
      middlewares: this.#middlewares,
      schema: this.#inputSchema,
      statusCode: this.#statusCode,
      noDefaultResponse: this.#noDefaultResponse,
      existenceCheck: this.#existenceCheck,
      description: this.#description,
      isDownloadable: this.#isDownloadable,
      media: this.#media,
      noAuth: this.#noAuth,
      encrypted: this.#encrypted,
      callback: this.#callback,
      callerModule: this.#callerModule
    }
  }

  /**
   * Creates a new builder instance with updated configuration.
   * Used internally to maintain immutability when chaining methods.
   *
   * @internal
   */
  private cloneWith<
    NewSchemas extends CleanedSchemas = TSchemas,
    NewMethod extends TMethod = TMethod,
    NewInput extends InputSchema<NewMethod> = InputSchema<NewMethod>,
    NewOutput = TOutput,
    NewMedia extends MediaConfig | null = TMedia
  >(
    overrides: Partial<{
      method: NewMethod
      middlewares: any[]
      inputSchema: NewInput
      statusCode: number
      noDefaultResponse: boolean
      existenceCheck: {
        body?: Record<keyof InferZodType<NewInput['body']>, string>
        query?: Record<keyof InferZodType<NewInput['query']>, string>
      }
      description: string
      isDownloadable: boolean
      media: NewMedia
      noAuth: boolean
      encrypted: boolean
      callback: (
        context: Context<NewSchemas, NewMethod, NewInput, NewOutput, NewMedia>
      ) => Promise<NewOutput>
    }>
  ): Forge<NewSchemas, NewMethod, NewInput, NewOutput, NewMedia> {
    return new Forge<NewSchemas, NewMethod, NewInput, NewOutput, NewMedia>({
      schemas: this.#schemas as unknown as NewSchemas,
      method: (overrides.method ?? this.#method) as NewMethod,
      middlewares: overrides.middlewares ?? [...this.#middlewares],
      inputSchema: (overrides.inputSchema ??
        this.#inputSchema) as unknown as NewInput,
      statusCode: overrides.statusCode ?? this.#statusCode,
      noDefaultResponse: overrides.noDefaultResponse ?? this.#noDefaultResponse,
      existenceCheck: overrides.existenceCheck ?? { ...this.#existenceCheck },
      description: overrides.description ?? this.#description,
      isDownloadable: overrides.isDownloadable ?? this.#isDownloadable,
      media: (overrides.media ?? this.#media) as NewMedia,
      noAuth: overrides.noAuth ?? this.#noAuth,
      encrypted: overrides.encrypted ?? this.#encrypted,
      callback: overrides.callback ?? (this.#callback as any),
      callerModule: this.#callerModule
    })
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
  ): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      middlewares: [...this.#middlewares, ...middlewares]
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
  ): Forge<TSchemas, TMethod, TInput, TOutput, NewMedia> {
    return this.cloneWith<TSchemas, TMethod, TInput, TOutput, NewMedia>({
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
  ): Forge<TSchemas, TMethod, T, TOutput, TMedia> {
    return this.cloneWith<TSchemas, TMethod, T, TOutput, TMedia>({
      inputSchema: { ...this.#inputSchema, ...schema } as unknown as T
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
  statusCode(code: number): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
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
  noDefaultResponse(): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
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
    map: T extends 'body'
      ? Partial<
          Record<
            keyof InferZodType<TInput['body']>,
            CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
          >
        >
      : T extends 'query'
        ? Partial<
            Record<
              keyof InferZodType<TInput['query']>,
              CollectionKey<TSchemas> | `[${CollectionKey<TSchemas>}]`
            >
          >
        : never
  ): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      existenceCheck: {
        ...this.#existenceCheck,
        [type]: map
      }
    })
  }

  /**
   * Sets a human-readable description for this endpoint.
   * Can be used for API documentation generation.
   *
   * @param desc - string text or localized description object
   * @returns New builder instance with description
   *
   * @example
   * ```typescript
   * controller.description('Creates a new user account')
   * ```
   */
  description(desc: string): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
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
  noAuth(): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
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
  noEncryption(): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
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
  isDownloadable(): Forge<TSchemas, TMethod, TInput, TOutput, TMedia> {
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
    CB extends (
      context: Context<TSchemas, TMethod, TInput, any, TMedia>
    ) => Promise<any>
  >(
    cb: CB
  ): Forge<
    void, // throw away TSchemas since it's not needed for the output type yay
    TMethod,
    TInput,
    Awaited<ReturnType<CB>>,
    TMedia
  > {
    const callerModule = getCallerModuleId()

    this.#callerModule =
      callerModule?.source === 'app' ? callerModule : this.#callerModule

    return this.cloneWith<
      TSchemas,
      TMethod,
      TInput,
      Awaited<ReturnType<CB>>,
      TMedia
    >({
      callback: cb as any
    }) as any
  }
}

/**
 * Initial builder class for routes without schema defined yet.
 * Provides methods that can be called before `.input()`.
 *
 * @template TMethod - HTTP method type ('get' | 'post')
 * @internal Use `forgeController.query()` or `forgeController.mutation()` instead
 */
class ForgeControllerBuilderWithoutInput<
  TSchemas extends CleanedSchemas,
  TMethod extends 'get' | 'post' = 'get'
> {
  #description: string = ''
  #noAuth: boolean = false
  #encrypted: boolean = true
  #method: TMethod
  #schemas: TSchemas
  #callerModule?: string

  constructor(method: TMethod, schemas: TSchemas, callerModule?: string) {
    this.#method = method
    this.#schemas = schemas
    this.#callerModule = callerModule
  }

  /**
   * Sets a description before defining the input schema.
   * @see Forge.description
   */
  description(desc: string): this {
    this.#description = desc

    return this
  }

  /**
   * Disables authentication before defining the input schema.
   * @see Forge.noAuth
   */
  noAuth(): this {
    this.#noAuth = true

    return this
  }

  /**
   * Disables encryption before defining the input schema.
   * @see Forge.noEncryption
   */
  noEncryption(): this {
    this.#encrypted = false

    return this
  }

  /**
   * Sets the input validation schema and transitions to the full builder.
   * @see Forge.input
   */
  input<T extends InputSchema<TMethod>>(
    inputSchema: T
  ): Forge<TSchemas, TMethod, T, unknown, null> {
    return new Forge<TSchemas, TMethod, T, unknown, null>({
      schemas: this.#schemas,
      method: this.#method,
      inputSchema: inputSchema,
      description: this.#description,
      noAuth: this.#noAuth,
      encrypted: this.#encrypted,
      callerModule: this.#callerModule
        ? { source: 'core', id: this.#callerModule }
        : undefined
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
function createForge<TSchema extends CleanedSchemas>(
  schemas: TSchema,
  callerModule?: string
) {
  return {
    /**
     * Creates a new GET request controller builder.
     * @returns A new ForgeControllerBuilderWithoutInput for GET requests
     */
    query: () =>
      new ForgeControllerBuilderWithoutInput('get', schemas, callerModule),

    /**
     * Creates a new POST request controller builder.
     * @returns A new ForgeControllerBuilderWithoutInput for POST requests
     */
    mutation: () =>
      new ForgeControllerBuilderWithoutInput('post', schemas, callerModule)
  }
}

export default createForge
