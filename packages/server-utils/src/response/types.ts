import { z } from 'zod'

import { ErrorOutputKey, OutputType, SuccessOutputKey } from './status'

/**
 * Standard envelope returned by every HTTP endpoint.
 *
 * `state` describes the outcome, `data` carries the success payload (if any),
 * and `message` carries a human-readable error or notice.
 */
export interface BaseResponse<T = ''> {
  data?: T
  state: 'success' | 'error' | 'accepted'
  message?: string
}

/**
 * Declares which success statuses a route can produce, mapped to the Zod schema
 * of their payload (or `true` for statuses without a payload, e.g. `NO_CONTENT`).
 *
 * Only success statuses (`OK`, `CREATED`, `ACCEPTED`, `NO_CONTENT`) may be
 * declared. Error responses are handled by the universal error helpers and do
 * not need to be listed here.
 *
 * @example
 * ```ts
 * output: { OK: eventsSchema, NO_CONTENT: true }
 * ```
 */
export type OutputDefinition = {
  [K in SuccessOutputKey]?: OutputType[K] extends {
    hasPayload: true
  }
    ? z.ZodTypeAny
    : true
}

/**
 * Maps each declared success status to its response helper, e.g. `OK` →
 * `response.ok(payload)` and `NO_CONTENT` → `response.noContent()`.
 *
 * The helper name and HTTP status come from `Output` in `status.ts`; the payload
 * type is inferred from the schema declared in `OutputDefinition`.
 */
type SuccessHelpers<TOutputs> = {
  [
    K in Extract<keyof TOutputs, SuccessOutputKey> as OutputType[K]['key']
  ]-?: K extends keyof OutputType
    ? OutputType[K] extends {
        hasPayload: true
      }
      ? (payload: z.infer<Extract<TOutputs[K], z.ZodTypeAny>>) => {
          $status: OutputType[K]['$status']
          payload: z.infer<Extract<TOutputs[K], z.ZodTypeAny>>
        }
      : () => {
          $status: OutputType[K]['$status']
        }
    : never
}

/**
 * Universal response helpers available on every route, regardless of its
 * `output` declaration: `badRequest`, `unauthorized`, `forbidden`, `notFound`,
 * and `conflict`.
 *
 * They are derived from the error entries of `Output` in `status.ts`, so adding
 * a new error status there automatically exposes a matching helper.
 */
export type ErrorHelpers = {
  [K in ErrorOutputKey as OutputType[K]['key']]-?: OutputType[K] extends {
    hasPayload: true
  }
    ? (payload?: string) => {
        $status: OutputType[K]['$status']
        payload?: string
      }
    : () => {
        $status: OutputType[K]['$status']
      }
}

/**
 * The full `response` object exposed to a route callback.
 *
 * For a `'custom'` output (the route writes to the response directly) no helpers
 * are provided; otherwise it is the declared success helpers combined with the
 * universal error helpers.
 */
export type OutputHelpers<TOutputs extends OutputDefinition | 'custom'> =
  TOutputs extends 'custom'
    ? Record<never, never>
    : SuccessHelpers<TOutputs> & ErrorHelpers

/**
 * Union of every error response a route callback may return, derived from the
 * error entries of `Output` in `status.ts`.
 */
export type ErrorResult = {
  [K in ErrorOutputKey]: OutputType[K] extends { hasPayload: true }
    ? {
        $status: OutputType[K]['$status']
        payload?: string
      }
    : {
        $status: OutputType[K]['$status']
      }
}[ErrorOutputKey]

/**
 * Union of the success responses a route callback may return, derived from the
 * statuses declared in its `output` and the payload schemas attached to them.
 */
type SuccessResult<TOutputs> = {
  [K in Extract<keyof TOutputs, SuccessOutputKey>]: {
    $status: K extends keyof OutputType ? OutputType[K]['$status'] : number
  } & (K extends keyof OutputType
    ? OutputType[K] extends { hasPayload: true }
      ? { payload: z.infer<Extract<TOutputs[K], z.ZodTypeAny>> }
      : { payload?: never }
    : { payload?: never })
}[Extract<keyof TOutputs, SuccessOutputKey>]

/**
 * The value a route callback must return: one of its declared success responses
 * or one of the universal error responses.
 *
 * `'custom'` routes may return anything (or nothing), since they manage the
 * response themselves.
 */
export type ResponseObject<TOutputs extends OutputDefinition | 'custom'> =
  TOutputs extends 'custom'
    ? void | undefined | unknown
    : SuccessResult<TOutputs> | ErrorResult
