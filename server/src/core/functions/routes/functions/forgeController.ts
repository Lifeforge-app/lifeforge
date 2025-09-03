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
 * - `forgeController`: Factory for creating new controller builders with `query` (GET) and `mutation` (POST) methods
 * - `bulkRegisterControllers`: Utility for registering multiple controllers
 *
 * @example
 * ```typescript
 * const controller = forgeController.mutation
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
import { checkExistence } from '@functions/database'
import { LoggingService } from '@functions/logging/loggingService'
import { fieldsUploadMiddleware } from '@middlewares/uploadMiddleware'
import COLLECTION_SCHEMAS from '@schema'
import { Tool } from 'ai'
import type { Request, Response, Router } from 'express'
import { z } from 'zod/v4'

import {
  BaseResponse,
  Context,
  ConvertMedia,
  InferZodType,
  InputSchema,
  MediaConfig
} from '../typescript/forge_controller.types'
import {
  ClientError,
  clientError,
  serverError,
  successWithBaseResponse
} from '../utils/response'
import restoreFormDataType from '../utils/restoreDataType'
import { splitMediaAndData } from '../utils/splitMediaAndData'
import { validateAuthToken } from '../utils/updateAuth'

/**
 * A fluent builder class for creating type-safe Express.js route controllers with validation.
 * Provides comprehensive schema validation, middleware support, and automatic error handling.
 *
 * @template TMethod - HTTP method type ('get' | 'post')
 * @template TInput - InputSchema containing body and query validation schemas
 * @template TOutput - The inferred return type from the callback function
 *
 * @example
 * ```typescript
 * const controller = forgeController.mutation
 *   .input({
 *     body: z.object({ name: z.string(), age: z.number() }),
 *     query: z.object({ page: z.string().optional() })
 *   })
 *   .callback(async ({ body, query }) => {
 *     // Handler logic here
 *     return { success: true }
 *   })
 * ```
 */
export class ForgeControllerBuilder<
  TMethod extends 'get' | 'post' = 'get',
  TInput extends InputSchema = InputSchema,
  TOutput = unknown,
  TMedia extends MediaConfig | null = null
> {
  /** Indicates that this class is a ForgeController */
  public __isForgeController!: true

  /** The type of input and output, used for type inference */
  public __method!: TMethod
  public __input!: TInput
  public __output!: TOutput
  public __media!: TMedia

  /** The HTTP method for this route (get, post) */
  protected _method: TMethod = 'get' as TMethod

  /** Array of Express middleware functions to apply to this route */
  protected _middlewares: any[] = []

  /** Zod validation schemas for request body and query */
  protected _schema: TInput = {
    body: undefined,
    query: undefined
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

  /** Media input configuration for the response */
  protected _media: TMedia = {} as TMedia

  protected _isAIToolCallingEnabled = false

  protected _noAuth = false

  /** The main callback function to handle the request */
  protected _callback: (
    context: Context<TInput, TOutput, TMedia>
  ) => Promise<TOutput> = async () => {
    // Default implementation
    return {} as TOutput
  }

  /** The main request handler function with proper typing for request/response objects */
  protected _handler?: (
    req: Request<
      never,
      any,
      InferZodType<TInput['body']>,
      InferZodType<TInput['query']>
    >,
    res: Response<BaseResponse<any>>
  ) => Promise<void>

  /**
   * Creates a new builder instance with updated schema types while preserving current configuration.
   * Used internally to maintain immutability when chaining methods.
   *
   * @template NewMethod - New HTTP method type
   * @template NewInput - New input schema type
   * @template NewOutput - New output type
   * @param overrides - Partial schema overrides to apply
   * @returns New builder instance with updated types
   */
  private cloneWith<
    NewMethod extends TMethod = TMethod,
    NewInput extends InputSchema = TInput,
    NewOutput = TOutput,
    NewMedia extends MediaConfig | null = TMedia
  >(overrides: Partial<InputSchema>, media: NewMedia) {
    const builder = new ForgeControllerBuilder<
      NewMethod,
      NewInput,
      NewOutput,
      NewMedia
    >()

    builder._method = this._method as NewMethod
    builder._middlewares = [...this._middlewares]
    builder._schema = { ...this._schema, ...overrides } as unknown as NewInput
    builder._media = media as NewMedia
    builder._statusCode = this._statusCode
    builder._existenceCheck = this._existenceCheck
    builder._noDefaultResponse = this._noDefaultResponse
    builder._description = this._description
    builder._isDownloadable = this._isDownloadable
    builder._isAIToolCallingEnabled = this._isAIToolCallingEnabled
    builder._noAuth = this._noAuth
    builder._callback = this._callback as any

    return builder
  }

  /**
   * Sets the HTTP method for the route.
   *
   * @param method - HTTP method ('get' | 'post')
   * @returns This builder instance for method chaining
   */
  method(method: TMethod) {
    this._method = method

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

  media<NewMedia extends MediaConfig>(config: NewMedia) {
    return this.cloneWith<TMethod, TInput, TOutput, NewMedia>({}, config)
  }

  /**
   * Sets Zod validation schemas for request input (body and query parameters).
   * Enables automatic validation and type inference for the route handler.
   *
   * @template T - Object containing optional input schema definitions
   * @param input - Object with optional body and query Zod schemas
   * @returns New builder instance with updated input schema types
   *
   * @example
   * ```typescript
   * controller.input({
   *   body: z.object({ name: z.string(), age: z.number() }),
   *   query: z.object({ page: z.string().optional() })
   * })
   * ```
   */
  input<T extends InputSchema>(input: T) {
    return this.cloneWith<TMethod, T, TOutput>(
      {
        ...input
      },
      this._media
    )
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
   * @template T - The request section to validate ('body' | 'query')
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
  existenceCheck<T extends 'body' | 'query'>(
    type: T,
    map: T extends 'body'
      ? Partial<
          Record<
            keyof InferZodType<TInput['body']>,
            | keyof typeof COLLECTION_SCHEMAS
            | `[${keyof typeof COLLECTION_SCHEMAS}]`
          >
        >
      : T extends 'query'
        ? Partial<
            Record<
              keyof InferZodType<TInput['query']>,
              | keyof typeof COLLECTION_SCHEMAS
              | `[${keyof typeof COLLECTION_SCHEMAS}]`
            >
          >
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

  enableAIToolCall() {
    this._isAIToolCallingEnabled = true

    return this
  }

  noAuth() {
    this._noAuth = true

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
   * @template CB - Callback function type
   * @param cb - The route handler function that processes the request
   * @returns New builder instance with inferred output type
   *
   * @example
   * ```typescript
   * const controller = forgeController.mutation
   *   .input({
   *     body: z.object({ name: z.string() })
   *   })
   *   .callback(async ({ req, res, body, query, pb, io }) => {
   *     // body, query are fully typed based on input schemas
   *     const user = await pb.collection('users').create(body)
   *     return { success: true, user } // Return type is automatically inferred
   *   })
   * // controller now has the return type { success: boolean, user: User } as OutputType
   * ```
   */
  callback<CB extends (context: Context<TInput, any, TMedia>) => Promise<any>>(
    cb: CB
  ): ForgeControllerBuilder<TMethod, TInput, Awaited<ReturnType<CB>>, TMedia> {
    const schema = this._schema

    const options = {
      statusCode: this._statusCode,
      noDefaultResponse: this._noDefaultResponse,
      existenceCheck: this._existenceCheck,
      isDownloadable: this._isDownloadable
    }

    const _handler = (__media: TMedia, noAuth: boolean) => {
      async function __handler(
        req: Request<
          never,
          any,
          InferZodType<TInput['body']>,
          InferZodType<TInput['query']>
        >,
        res: Response<BaseResponse<Awaited<ReturnType<CB>>>>
      ): Promise<void> {
        const isValid = await validateAuthToken(req, res, noAuth)

        if (!isValid) return

        try {
          let finalMedia: ConvertMedia<TMedia> = {} as ConvertMedia<TMedia>

          for (const type of ['body', 'query'] as const) {
            const validator = schema[type] || z.object({})

            let result

            if (type === 'body') {
              const { data, media } = splitMediaAndData(
                __media,
                req[type],
                (req.files || {}) as Record<string, Express.Multer.File[]>
              )

              finalMedia = media as ConvertMedia<TMedia>

              const finalData = req.is('multipart/form-data')
                ? Object.fromEntries(
                    Object.entries(data).map(([key, value]) => [
                      key,
                      restoreFormDataType(value)
                    ])
                  )
                : data

              result = validator.safeParse(finalData)
            } else {
              result = validator.safeParse(req[type])
            }

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

          for (const [key, value] of Object.entries(
            __media || ({} as MediaConfig)
          )) {
            if (!value.optional && !finalMedia[key]) {
              return clientError(res, `Missing required media field "${key}"`)
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
            body: req.body,
            query: req.query,
            media: finalMedia
          })

          if (!options.noDefaultResponse) {
            res.status(options.statusCode || 200)
            successWithBaseResponse(res, result)
          }
        } catch (err) {
          if (ClientError.isClientError(err)) {
            return clientError(res, err.message, err.code)
          }
          LoggingService.error(
            err instanceof Error ? err.message : (err as string)
          )
          serverError(res, 'Internal server error')
        }
      }

      __handler.meta = {
        description: this._description,
        schema,
        options
      }

      return __handler
    }

    const newBuilder = new ForgeControllerBuilder<
      TMethod,
      TInput,
      Awaited<ReturnType<CB>>,
      TMedia
    >()

    newBuilder._method = this._method
    newBuilder._middlewares = [...this._middlewares]
    newBuilder._schema = this._schema
    newBuilder._media = this._media
    newBuilder._statusCode = this._statusCode
    newBuilder._existenceCheck = this._existenceCheck
    newBuilder._noDefaultResponse = this._noDefaultResponse
    newBuilder._description = this._description
    newBuilder._isDownloadable = this._isDownloadable
    newBuilder._isAIToolCallingEnabled = this._isAIToolCallingEnabled
    newBuilder._noAuth = this._noAuth
    newBuilder._handler = _handler(this._media, this._noAuth)
    newBuilder._callback = cb

    return newBuilder
  }

  public getToolConfig(
    ctx: Omit<Context<TInput, TOutput, TMedia>, 'body' | 'query' | 'media'>
  ): Tool {
    if (!this._isAIToolCallingEnabled) {
      throw new Error('AI tool calling is not enabled for this controller')
    }

    if (!this._handler) {
      throw new Error(
        'Missing handler. Have you called .callback() when defining the controller?'
      )
    }

    return {
      description: this._description,
      inputSchema: z.object({
        body: this._schema.body || z.object({}),
        query: this._schema.query || z.object({})
      }),
      execute: async input => {
        LoggingService.info(
          `AI tool calling controller - ${
            this._description || '(no description)'
          }`,
          'AGENT'
        )

        return await this._callback({ ...ctx, ...input })
      }
    } satisfies Tool
  }

  get isAIToolCallingEnabled() {
    return this._isAIToolCallingEnabled
  }

  /**
   * Registers this controller with an Express router.
   * This must be called after setting up the schema and callback.
   *
   * @param router - Express router instance to register the route with
   * @throws {Error} When handler is missing
   *
   * @example
   * ```typescript
   * import forgeRouter from '@functions/forgeRouter'
   * controller.register(router)
   * ```
   */
  register(router: Router, routeName: string = '') {
    if (!this._handler) {
      throw new Error('Missing handler. Use .callback() before .register()')
    }

    router[this._method](
      `/${routeName}`,
      [
        ...(Object.keys(this._media ?? {}).length > 0
          ? [
              fieldsUploadMiddleware(
                Object.fromEntries(
                  Object.entries(this._media ?? ({} as MediaConfig)).map(
                    ([key, value]) => [key, value.multiple ? 999 : 1]
                  )
                )
              )
            ]
          : []),
        ...this._middlewares
      ],
      this._handler
    )
  }
}

/**
 * Initial builder class that requires input schemas to be set before proceeding.
 * Enforces the pattern where routes must have input validation defined.
 *
 * @template TMethod - HTTP method type ('get' | 'post')
 */
class ForgeControllerBuilderWithoutSchema<
  TMethod extends 'get' | 'post' = 'get'
> {
  /** Human-readable description of what this endpoint does */
  protected _description = ''
  protected _noAuth = false

  constructor(public _method: TMethod) {}

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

  noAuth() {
    this._noAuth = true

    return this
  }

  /**
   * Sets the input validation schemas and transitions to the full builder.
   * Transforms the initial builder into a fully-featured controller builder.
   *
   * @template T - Object containing optional input schema definitions
   * @param input - Object with optional body and query Zod schemas
   * @returns New fully-featured builder instance with input schema types applied
   *
   * @example
   * ```typescript
   * forgeController.mutation
   *   .input({
   *     body: z.object({ name: z.string() }),
   *     query: z.object({ id: z.string() })
   *   })
   *   .callback(async ({ body }) => {
   *     // body is now typed
   *     return { success: true }
   *   })
   * ```
   */
  input<T extends InputSchema>(input: T) {
    let controller = new ForgeControllerBuilder<TMethod, T>()
      .method(this._method)
      .input(input)
      .description(this._description)

    if (this._noAuth) {
      controller = controller.noAuth()
    }

    return controller
  }
}

/**
 * Creates a proxy for initializing controller builders with specific HTTP methods.
 *
 * @template TMethod - HTTP method type ('get' | 'post')
 * @param method - The HTTP method to initialize the builder with
 * @returns A proxy object that creates a new builder instance
 */
function createMethodProxy<TMethod extends 'get' | 'post'>(method: TMethod) {
  const builder = new ForgeControllerBuilderWithoutSchema<TMethod>(method)

  return new Proxy(builder, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver)
    }
  })
}

/**
 * Factory object for creating controller builders for different HTTP methods.
 * Provides `query` for GET requests and `mutation` for POST requests.
 */
const forgeController = {
  query: createMethodProxy('get'),
  mutation: createMethodProxy('post')
}

export default forgeController
