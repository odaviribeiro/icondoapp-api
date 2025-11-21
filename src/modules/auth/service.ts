import { eq } from 'drizzle-orm'
import * as argon2 from 'argon2'
import { SignJWT } from 'jose'
import { users } from '../../db/schema'
import { getDb } from '../../db/db'
import { SignUpDTO } from './dto'

export async function createUser({
  name,
  email,
  password,
  acceptedTerms,
  birthDate,
  phone,
}: SignUpDTO) {
  const database = getDb()

  const exists = await database.query.users.findFirst({
    where: eq(users.email, email),
  })
  if (exists) throw new Error('User exists')

  const hashed = await argon2.hash(password)
  const dateOfBirth = new Date(birthDate)

  await database.insert(users).values({
    name: name,
    email: email,
    password: hashed,
    birthDate: dateOfBirth,
    acceptedTerms,
    phone: phone,
  })

  return { name, email }
}

export async function signinUser(email: string, password: string) {
  const database = getDb()
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) throw new Error('Invalid credentials')

  const match = await argon2.verify(user.password, password)
  if (!match) throw new Error('Invalid credentials')

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  return { token }
}
