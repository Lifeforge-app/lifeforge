import { Router } from 'express'
import { ZodTypeAny } from 'zod/v4'

import { ForgeControllerBuilder } from '../functions/forgeController'
import { ZodObjectOrIntersection } from './forge_controller.types'

// Define the controller type
export type ControllerType = ForgeControllerBuilder<
  ZodObjectOrIntersection | undefined,
  ZodObjectOrIntersection | undefined,
  ZodObjectOrIntersection | undefined,
  ZodTypeAny
>

// Define the router input type to support nested structures like tRPC
export interface RouterInput {
  [key: string]: Router | ControllerType | RouterInput
}

// Enhanced type-preserving router that maintains the input structure for type inference
export type ForgeRouter<T extends RouterInput> = {
  _type: T
  expressRouter: Router
}

// Type utility to extract the structure from the router
export type InferRouterStructure<T> = T extends ForgeRouter<infer U> ? U : never

// Helper type to get all controller paths in a nested structure
export type GetRouterPaths<T> = T extends ControllerType
  ? T
  : T extends RouterInput
    ? {
        [K in keyof T]: T[K] extends ControllerType
          ? T[K]
          : T[K] extends RouterInput
            ? GetRouterPaths<T[K]>
            : never
      }
    : never

// Type to extract all available routes in dot notation (like tRPC)
export type RouterPaths<T> = T extends RouterInput
  ? {
      [K in keyof T]: T[K] extends ControllerType
        ? K
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
