import { Router } from 'express'

// Define the controller type

// Define the router input type to support nested structures like tRPC
export interface RouterInput {
  [key: string]:
    | Router
    | {
        __isForgeController: true
      }
    | RouterInput
}

export type ForgeRouter<T extends RouterInput> = T

// Type utility to extract the structure from the router
export type InferRouterStructure<T> = T extends ForgeRouter<infer U> ? U : never

// Helper type to get all controller paths in a nested structure
export type GetRouterPaths<T> = T extends { __isForgeController: true }
  ? T
  : T extends RouterInput
    ? {
        [K in keyof T]: T[K] extends { __isForgeController: true }
          ? T[K]
          : T[K] extends RouterInput
            ? GetRouterPaths<T[K]>
            : never
      }
    : never

// Type to extract all available routes in dot notation (like tRPC)
export type RouterPaths<T> = T extends RouterInput
  ? {
      [K in keyof T]: T[K] extends {
        __isForgeController: true
        __type: infer Type
        __input: infer Input
        __media: infer Media
        __output: infer Output
      }
        ? {
            __isForgeController: true
            __type: Type
            __input: Input
            __media: Media
            __output: Output
          }
        : T[K] extends RouterInput
          ? `${K & string}.${RouterPaths<T[K]> & string}`
          : never
    }[keyof T]
  : never

// Type to get the controller at a specific path
export type GetController<
  T,
  P extends string
> = P extends `${infer Head}.${infer Tail}`
  ? T extends RouterInput
    ? Head extends keyof T
      ? GetController<T[Head], Tail>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never
