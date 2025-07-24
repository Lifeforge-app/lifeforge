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
  public _output!: TOutput

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
}
