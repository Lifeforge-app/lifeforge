export default class ClientError extends Error {
  code: number

  constructor(message: any, code: number = 400) {
    super(message)
    this.name = 'ClientError'
    this.code = code
    Object.setPrototypeOf(this, ClientError.prototype)
  }

  static isClientError(error: unknown): error is ClientError {
    return error instanceof ClientError
  }
}
