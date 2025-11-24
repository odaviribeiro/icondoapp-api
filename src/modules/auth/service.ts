import { eq } from 'drizzle-orm'
import * as argon2 from 'argon2'
import { jwtVerify, SignJWT } from 'jose'
import { users, refreshTokens } from '../../db/schema'
import { getDb } from '../../db/db'
import { SignUpDTO } from './dto'
import { GlobalResponse } from '../../types/http'
import { SignInData, SignUpData, RefreshData, MeData } from './types'

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET)
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)

export async function createUser(dto: SignUpDTO): Promise<GlobalResponse<SignUpData>> {
  const db = getDb()

  const exists = await db.query.users.findFirst({
    where: eq(users.email, dto.email),
  })

  if (exists) {
    return {
      success: false,
      error: 'USER_ALREADY_EXISTS',
    }
  }

  const hashed = await argon2.hash(dto.password)
  const dateOfBirth = new Date(dto.birthDate)

  await db.insert(users).values({
    name: dto.name,
    email: dto.email,
    password: hashed,
    birthDate: dateOfBirth,
    acceptedTerms: dto.acceptedTerms,
    phone: dto.phone,
  })

  return {
    success: true,
    error: null,
    data: {
      message: 'Success create user.',
      user: {
        name: dto.name,
        email: dto.email,
      },
    },
  }
}

export async function signinUser(
  email: string,
  password: string
): Promise<GlobalResponse<SignInData>> {
  const db = getDb()
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
    }
  }

  const match = await argon2.verify(user.password, password)
  if (!match) {
    return {
      success: false,
      error: 'INVALID_CREDENTIALS',
    }
  }

  const accessToken = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(accessSecret)

  const refreshToken = await new SignJWT({
    id: user.id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(refreshSecret)

  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  const response: GlobalResponse<SignInData> = {
    success: true,
    error: null,
    data: {
      message: 'Login success.',
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      user: {
        name: user.name,
        email: user.email,
      },
    },
  }

  return response
}

export async function refreshTokenService(
  token: string
): Promise<GlobalResponse<RefreshData>> {
  try {
    const payload = await jwtVerify(token, refreshSecret)
    const userId = payload.payload.id as number

    const db = getDb()

    const stored = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, token),
    })

    if (!stored) return { success: false, error: 'Refresh token invalid.' }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) return { success: false, error: 'User not found', data: null }

    const newAccess = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(accessSecret)

    return {
      success: true,
      error: null,
      data: {
        access_token: newAccess,
      },
    }
  } catch {
    return { success: false, error: 'Refresh token inválido', data: null }
  }
}

export async function meService(userId: string): Promise<GlobalResponse<MeData>> {
  try {
    const db = getDb()

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) throw new Error('INVALID_CREDENTIALS')

    return {
      success: true,
      error: null,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthDate: user.birthDate,
        role: user.role,
      },
    }
  } catch {
    return { success: false, error: 'Token inválido' }
  }
}

export async function logoutService(refreshToken: string): Promise<GlobalResponse<null>> {
  const db = getDb()

  await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken))

  return {
    success: true,
    error: null,
  }
}
