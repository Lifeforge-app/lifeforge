/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCallerModuleId } from '@functions/utils/getCallerModuleId'

import {
  Context,
  Description,
  InferZodType,
  InputSchema,
  MediaConfig
} from '../typescript/forge_controller.types'

// ============================================================================
// Stripped Controller Builder
// ============================================================================

export class ForgeControllerBuilder<
  TMethod extends 'get' | 'post' = 'get',
  TInput extends InputSchema<TMethod> = InputSchema<TMethod>,
  TOutput = unknown,
  TMedia extends MediaConfig | null = null
> {
  /** Marker for type identification */
  public readonly __isForgeController = true as const

  /** Type inference markers (never assigned at runtime) */
  public __method!: TMethod
  public __input!: TInput
  public __output!: TOutput
  public __media!: TMedia

  /** Stored configuration */
  protected _method: TMethod
  protected _middlewares: any[] = []
  protected _schema: TInput
  protected _statusCode: number
  protected _noDefaultResponse: boolean
  protected _existenceCheck: {
    body?: Record<keyof InferZodType<TInput['body']>, string>
    query?: Record<keyof InferZodType<TInput['query']>, string>
  }
  protected _description: Description
  protected _isDownloadable: boolean
  protected _media: TMedia
  protected _noAuth: boolean
  protected _encrypted: boolean
  protected _callback:
    | ((context: Context<TMethod, TInput, TOutput, TMedia>) => Promise<TOutput>)
    | null
  protected _callerModule?: { source: string; id: string }

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

  // ============================================================================
  // Value Getter
  // ============================================================================

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

  // ============================================================================
  // Private clone helper
  // ============================================================================

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

  // ============================================================================
  // Fluent API methods (same names as original forgeController)
  // ============================================================================

  middlewares(
    ...middlewares: any[]
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      middlewares: [...this._middlewares, ...middlewares]
    })
  }

  media<NewMedia extends MediaConfig>(
    config: NewMedia
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, NewMedia> {
    return this.cloneWith<TMethod, TInput, TOutput, NewMedia>({
      media: config
    })
  }

  input<T extends InputSchema<TMethod>>(
    schema: T
  ): ForgeControllerBuilder<TMethod, T, TOutput, TMedia> {
    return this.cloneWith<TMethod, T, TOutput, TMedia>({
      schema: { ...this._schema, ...schema } as unknown as T
    })
  }

  statusCode(
    code: number
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ statusCode: code })
  }

  noDefaultResponse(): ForgeControllerBuilder<
    TMethod,
    TInput,
    TOutput,
    TMedia
  > {
    return this.cloneWith({ noDefaultResponse: true })
  }

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

  description(
    desc: Description
  ): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ description: desc })
  }

  noAuth(): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ noAuth: true })
  }

  noEncryption(): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({ encrypted: false })
  }

  isDownloadable(): ForgeControllerBuilder<TMethod, TInput, TOutput, TMedia> {
    return this.cloneWith({
      isDownloadable: true,
      noDefaultResponse: true,
      statusCode: 200
    })
  }

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

// ============================================================================
// Initial Builder (without schema)
// ============================================================================

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

  description(desc: Description): this {
    this._description = desc

    return this
  }

  noAuth(): this {
    this._noAuth = true

    return this
  }

  noEncryption(): this {
    this._encrypted = false

    return this
  }

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

// ============================================================================
// Factory
// ============================================================================

const forgeController = {
  query: () => new ForgeControllerBuilderWithoutSchema('get'),
  mutation: () => new ForgeControllerBuilderWithoutSchema('post')
}

export default forgeController
