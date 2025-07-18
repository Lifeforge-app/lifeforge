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

class ForgeControllerBuilder<
  BodySchema extends ZodObject<ZodRawShape> | undefined = undefined,
  QuerySchema extends ZodObject<ZodRawShape> | undefined = undefined,
  ParamsSchema extends ZodObject<ZodRawShape> | undefined = undefined,
  ResponseSchema extends ZodTypeAny = ZodTypeAny
> {
  protected _method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get'
  protected _path: string = ''
  protected _middlewares: any[] = []

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

  protected _statusCode = 200
  protected _noDefaultResponse = false
  protected _existenceCheck: any = {}
  protected _description = ''
  protected _isDownloadable = false

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

  middlewares(...middlewares: any[]) {
    this._middlewares.push(...middlewares)
    return this
  }

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

  statusCode(code: number) {
    this._statusCode = code
    return this
  }

  noDefaultResponse() {
    this._noDefaultResponse = true
    return this
  }

  existenceCheck(
    type: 'params' | 'body' | 'query',
    map: Record<string, string>
  ) {
    this._existenceCheck[type] = map
    return this
  }

  description(desc: string) {
    this._description = desc
    return this
  }

  isDownloadable() {
    this._isDownloadable = true
    this._noDefaultResponse = true
    this._statusCode = 200
    return this
  }

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

export const forgeController = {
  route: <
    BodySchema extends ZodObject<ZodRawShape> | undefined = undefined,
    QuerySchema extends ZodObject<ZodRawShape> | undefined = undefined,
    ParamsSchema extends ZodObject<ZodRawShape> | undefined = undefined,
    ResponseSchema extends ZodTypeAny = ZodTypeAny
  >(
    routeString: string
  ) =>
    new ForgeControllerBuilder<
      BodySchema,
      QuerySchema,
      ParamsSchema,
      ResponseSchema
    >().route(routeString)
}

export const bulkRegisterControllers = (
  router: import('express').Router,
  controllers: ForgeControllerBuilder<any, any, any, any>[]
) => {
  for (const controller of controllers) {
    controller.register(router)
  }
}
