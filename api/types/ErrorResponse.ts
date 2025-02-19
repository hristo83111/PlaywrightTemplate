interface Errors {
  email: string[]
  username: string[]
}

export interface ErrorResponse {
  errors: Errors
}
