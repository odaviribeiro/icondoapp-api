import { Hono } from 'hono'
import { SignUpSchema, SignInSchema } from './dto'
import { createUser, signinUser } from './service'
import { authMiddleware } from './middleware'
import { z } from 'zod'
import { AuthContext } from './types'

const auth = new Hono()

auth.post('/signup', async c => {
  const json = await c.req.json()
  const result = SignUpSchema.safeParse(json)
  console.log('Coe: ', { json, result: !result.success })
  if (!result.success) {
    return c.json({ errors: z.treeifyError(result.error) }, 400)
  }

  try {
    const user = await createUser({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
      birthDate: result.data.birthDate,
      phone: result.data.phone,
      acceptedTerms: result.data.acceptedTerms,
    })

    return c.json({ message: 'User created', user })
  } catch (err: any) {
    return c.json({ error: err.message }, 400)
  }
})

auth.post('/signin', async c => {
  const json = await c.req.json()
  const result = SignInSchema.safeParse(json)
  if (!result.success) {
    return c.json({ errors: z.treeifyError(result.error) }, 400)
  }

  try {
    const { token } = await signinUser(result.data.email, result.data.password)
    return c.json({ access_token: token })
  } catch (err: any) {
    return c.json({ error: err.message }, 401)
  }
})

auth.get('/me', authMiddleware, async (c: AuthContext) => {
  return c.json({ user: c.user })
})

export { auth }
