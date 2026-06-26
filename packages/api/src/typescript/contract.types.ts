/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FromSchema } from "json-schema-to-ts";
import type { ZodTypeAny } from "zod";

export type OmitIndexSignature<T> = T extends object
  ? T extends Array<any>
    ? T
    : string extends keyof T
      ? unknown extends T[string]
        ? {
            [K in keyof T as string extends K
              ? never
              : number extends K
                ? never
                : symbol extends K
                  ? never
                  : K]: OmitIndexSignature<T[K]>
          }
        : { [K in keyof T]: OmitIndexSignature<T[K]> }
      : number extends keyof T
        ? unknown extends T[number]
          ? {
              [K in keyof T as string extends K
                ? never
                : number extends K
                  ? never
                  : symbol extends K
                    ? never
                    : K]: OmitIndexSignature<T[K]>
            }
          : { [K in keyof T]: OmitIndexSignature<T[K]> }
        : { [K in keyof T]: OmitIndexSignature<T[K]> }
  : T

export type InferFromJSONSchema<T> = 0 extends 1 & T
  ? any
  : T extends undefined
    ? undefined
    : T extends boolean
      ? undefined
      : T extends object
        ? OmitIndexSignature<FromSchema<T>>
        : undefined

export type InferContractInput<T> = 0 extends 1 & T
  ? any
  : T extends {
        readonly input?: {
          readonly query?: infer Q
          readonly body?: infer B
        }
      }
    ? {
        body: B extends ZodTypeAny
          ? B
          : B extends object
            ? InferFromJSONSchema<B>
            : undefined
        query: Q extends ZodTypeAny
          ? Q
          : Q extends object
            ? InferFromJSONSchema<Q>
            : undefined
      }
    : {
        body: undefined
        query: undefined
      }

export type InferContractOutput<T> = 0 extends 1 & T
  ? any
  : T extends {
        readonly output: infer O
      }
    ? O extends { readonly OK: infer OKSchema }
      ? InferFromJSONSchema<OKSchema>
      : O extends { readonly CREATED: infer CreatedSchema }
        ? InferFromJSONSchema<CreatedSchema>
        : any
    : never

export type InferContractMedia<T> = 0 extends 1 & T
  ? any
  : T extends {
        readonly media?: infer M
      }
    ? M extends undefined
      ? null
      : M
    : null
