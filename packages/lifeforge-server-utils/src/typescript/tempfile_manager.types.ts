export interface ITempFileManager {
  read<T>(): T
  write(data: Buffer | string): void
}

export interface ITempFileManagerConstructor {
  new (
    fileName: `${string}.json`,
    jsonType?: 'object' | 'array'
  ): ITempFileManager
}