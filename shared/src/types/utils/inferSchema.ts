import { z } from "zod/v4";

type SafeInfer<T> = T extends z.ZodTypeAny ? z.infer<T> : undefined;

export type InferApiESchemaDynamic<TSchema> = {
  [K in keyof TSchema]: {
    [Field in keyof TSchema[K]]: SafeInfer<TSchema[K][Field]>;
  };
};
