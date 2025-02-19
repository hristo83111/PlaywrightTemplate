interface User {
  id?: number
  email: string
  username: string
  bio?: unknown
  image?: string
  token?: string
}

export interface UserResponse {
  user: User
}
