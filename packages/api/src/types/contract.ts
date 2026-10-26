/* eslint-disable @typescript-eslint/no-explicit-any */

export type InferContractInput<T> = 0 extends 1 & T
  ? any
  : T extends {
        readonly input?: infer I
      }
    ? {
        body: I extends { readonly body?: infer B } ? B : undefined
        query: I extends { readonly query?: infer Q } ? Q : undefined
      }
    : {
        body: undefined
        query: undefined
      }

type InferSuccessPayload<O> =
  | (O extends { readonly OK: infer S } ? S : never)
  | (O extends { readonly CREATED: infer S } ? S : never)
  | (O extends { readonly ACCEPTED: infer S } ? S : never)
  | (O extends { readonly NO_CONTENT: infer S } ? S : never)

export type InferContractOutput<T> = 0 extends 1 & T
  ? any
  : T extends {
        readonly output: infer O
      }
    ? O extends 'custom'
      ? any
      : [InferSuccessPayload<O>] extends [never]
        ? any
        : InferSuccessPayload<O>
    : never

export type InferContractMedia<T> = 0 extends 1 & T
  ? any
  : T extends {
        readonly media?: infer M
      }
    ? M extends null | undefined
      ? null
      : M
    : null
