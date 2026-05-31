export type ReplaceFileWithMulter<T> = T extends File
  ? Express.Multer.File
  : T extends (infer U)[]
    ? ReplaceFileWithMulter<U>[]
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<ReplaceFileWithMulter<U>>
      : T extends object
        ? T extends (...args: unknown[]) => unknown
          ? T
          : { [K in keyof T]: ReplaceFileWithMulter<T[K]> }
        : T

export type MediaConfig = Record<
  string,
  {
    optional: boolean
    multiple?: boolean
  }
>

export type ConvertMedia<TMedia extends MediaConfig | null> =
  TMedia extends null
    ? Record<string, never>
    : {
        [K in keyof TMedia]: TMedia[K] extends { multiple: true }
          ? Express.Multer.File[]
          : TMedia[K] extends { optional: true }
            ? Express.Multer.File | string | undefined
            : Express.Multer.File | string
      }
