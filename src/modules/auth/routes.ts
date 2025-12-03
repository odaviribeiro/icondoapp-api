import { Hono } from 'hono'
import { SignUpSchema, SignInSchema } from './dto'
import {
  createUser,
  logoutService,
  meService,
  refreshTokenService,
  signinUser,
} from './service'
import { isAuthenticated } from './middleware'
import { z } from 'zod'
import { AuthContext } from './types'

const auth = new Hono()

auth.post('/signup', async c => {
  const json = await c.req.json()
  const parsed = SignUpSchema.safeParse(json)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await createUser(parsed.data)
  return c.json(response, response.success ? 200 : 400)
})

auth.post('/signin', async c => {
  const body = await c.req.json()
  const parsed = SignInSchema.safeParse(body)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await signinUser(parsed.data.email, parsed.data.password)

  return c.json(response, response.success ? 200 : 401)
})

auth.get('/me', isAuthenticated, async (c: AuthContext) => {
  if (!c.user) {
    return c.json({ success: false, error: 'INVALID_CREDENTIALS' }, 401)
  }

  const { id } = c.user

  const response = await meService(id)
  return c.json(response, response.success ? 200 : 401)
})

auth.post('/refresh', async c => {
  const { refresh_token } = await c.req.json()

  if (!refresh_token) {
    return c.json(
      {
        success: false,
        error: 'Missing refresh token.',
        data: null,
      },
      400
    )
  }

  const response = await refreshTokenService(refresh_token)
  return c.json(response, response.success ? 200 : 401)
})

auth.post('/logout', async c => {
  const { refresh_token } = await c.req.json()

  if (!refresh_token) {
    return c.json(
      {
        success: false,
        error: 'Missing refresh token',
        data: null,
      },
      400
    )
  }

  const response = await logoutService(refresh_token)
  return c.json(response, 200)
})

export { auth }
