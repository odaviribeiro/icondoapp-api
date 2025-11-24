import { HTTPException } from 'hono/http-exception'
import type { AuthContext } from './types'
import { verifyAccessToken } from '../../lib/jwt'

export const authMiddleware = async (c: AuthContext, next: () => Promise<void>) => {
  const header = c.req.header('authorization') || c.req.header('Authorization')
  if (!header) throw new HTTPException(401, { message: 'No token' })

  const token = header.replace(/^Bearer\s+/i, '')
  const payload = await verifyAccessToken(token)

  if (!payload) throw new HTTPException(401, { message: 'Invalid token' })

  c.user = payload
  await next()
}
