import { HTTPException } from 'hono/http-exception'
import { verifyAccessToken } from '../../lib/jwt'
import type { AuthContext } from './types'

export const isAuthenticated = async (c: AuthContext, next: () => Promise<void>) => {
  const header = c.req.header('authorization') || c.req.header('Authorization')

  if (!header) {
    throw new HTTPException(401, { message: 'No token provided' })
  }

  const token = header.replace(/^Bearer\s+/i, '')
  const payload = await verifyAccessToken(token)

  if (!payload) {
    throw new HTTPException(401, { message: 'Invalid or expired token' })
  }

  c.user = payload
  return next()
}

export function requireRole(...roles: string[]) {
  return async (c: AuthContext, next: () => Promise<void>) => {
    const header = c.req.header('authorization') || c.req.header('Authorization')

    console.log('Davi: ', header)

    if (!header) {
      throw new HTTPException(401, { message: 'No token provided' })
    }

    const token = header.replace(/^Bearer\s+/i, '')
    const payload = await verifyAccessToken(token)

    if (!payload) {
      throw new HTTPException(401, { message: 'Invalid or expired token' })
    }

    if (!payload.role || !roles.includes(payload.role)) {
      throw new HTTPException(403, { message: 'Forbidden: insufficient role' })
    }

    c.user = payload
    return next()
  }
}
