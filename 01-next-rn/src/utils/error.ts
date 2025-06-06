import { AuthError } from 'next-auth'

export class CustomAuthError extends AuthError {
  static type: string

  constructor(message?: any) {
    super()

    this.type = message
  }
}

export class InvalidEmailPasswordError extends AuthError {
  static type = 'Invalid credentials'
}
export class InActiveAccountError extends AuthError {
  static type = 'Inactive account'
}
