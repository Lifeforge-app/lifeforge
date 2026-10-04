import type { StagedFile } from '@lifeforge/file-storage'

export type ReplaceFileWithMulter<T> = T extends File
  ? StagedFile
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
          ? StagedFile[]
          : TMedia[K] extends { optional: true }
            ? StagedFile | string | undefined
            : StagedFile | string
      }
