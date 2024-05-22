export interface CreateUserDTO {
  name: string
  email: string
}

export interface User {
  id: number
  name: string | null
  email: string
}
