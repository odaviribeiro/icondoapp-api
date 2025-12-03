import type { Context } from 'hono'
import type { JWTPayload } from 'jose'

export interface AuthContext extends Context {
  user?: JwtUserPayload
}

export interface JwtUserPayload extends JWTPayload {
  id: string
  name: string
  email: string
  role:
    | 'PENDING'
    | 'OWNER'
    | 'TENANT'
    | 'DEPENDENT'
    | 'EMPLOYEE'
    | 'MANAGER'
    | 'ADMINISTRATOR'
}

export type SignInData = {
  message: string
  tokens: {
    access_token: string
    refresh_token: string
  }
  user: {
    name: string
    email: string
    role: string
    birthDate: string
    phone: string
    unityId: string
    condominiumId: string
  }
}

export type SignUpData = {
  message: string
  user: {
    name: string
    email: string
  }
}

export type RefreshData = {
  access_token: string
}

export type MeData = {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  role: string
}
