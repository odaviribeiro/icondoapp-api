import { HTTPException } from 'hono/http-exception'
import type { AuthContext } from './types'
import { verifyJwt } from '../../lib'

export const authMiddleware = async (c: AuthContext, next: () => Promise<void>) => {
  const header = c.req.header('authorization')
  if (!header) throw new HTTPException(401, { message: 'No token' })

  const token = header.replace('Bearer ', '')
  const payload = await verifyJwt(token)

  if (!payload) throw new HTTPException(401, { message: 'Invalid token' })

  c.user = payload
  await next()
}
