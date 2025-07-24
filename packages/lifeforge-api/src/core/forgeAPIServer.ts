/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express'
import type {
  InputSchema,
  InferZodType,
  BaseResponse
} from '../typescript/forge_api_server.types'

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
export class ForgeAPIServerControllerBase<
  TRoute extends string = string,
  TInput extends InputSchema = InputSchema,
  TOutput = unknown
> {
  public __output!: TOutput

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
