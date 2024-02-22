export class ClientError extends Error {
  static {
    this.prototype.name = 'ClientError'
  }
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export const errInvalidSession = () => new ClientError('Invalid Session')
export const errPermissionDenied = () => new ClientError('Permission denied')
export const errNotFound = () => new ClientError('Not Found')
export const errValidation = (message: string) => new ClientError(`validation error: ${message}`)
export const errSystemError = () => new Error('System Error')
