import { z } from 'zod'

import { OutputType } from '../../utils/outputStatus'

export type SnakeToCamel<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Lowercase<Head>}${Capitalize<SnakeToCamel<Tail>>}`
    : Lowercase<S>

export type OutputHelpers<TOutputs extends OutputDefinition> = {
  [K in keyof TOutputs as SnakeToCamel<
    K & string
  >]-?: K extends keyof OutputType
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

export type ResponseObject<TOutputs extends OutputDefinition> = {
  [K in keyof TOutputs]: {
    $status: K extends keyof OutputType ? OutputType[K]['$status'] : number
  } & (K extends keyof OutputType
    ? OutputType[K] extends { hasPayload: true }
      ? { payload: z.infer<Extract<TOutputs[K], z.ZodTypeAny>> }
      : { payload?: never }
    : { payload?: never })
}[keyof TOutputs]

export type OutputDefinition = {
  [K in keyof OutputType]?: OutputType[K] extends {
    hasPayload: true
  }
    ? z.ZodTypeAny
    : true
}
