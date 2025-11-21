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
