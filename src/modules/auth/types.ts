import type { Context } from 'hono'
import type { JWTPayload } from 'jose'

export interface AuthContext extends Context {
  user?: JWTPayload
}

export interface JwtUserPayload extends JWTPayload {
  id: string
  name: string
  email: string
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
}
