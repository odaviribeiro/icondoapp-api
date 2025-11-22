import { jwtVerify, SignJWT } from 'jose'
import { JwtUserPayload } from '../modules/auth/types'

/** Secrets diferentes */
const getAccessSecret = (): Uint8Array => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

const getRefreshSecret = (): Uint8Array => {
  if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not set')
  return new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)
}

/**
 * Gera um Access Token
 * @param payload - payload do user
 * @param expiresIn - ex: "15m"
 */
export const signAccessToken = (
  payload: JwtUserPayload,
  expiresIn = '15m'
): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(getAccessSecret())
}

/**
 * Gera um Refresh Token
 * @param payload - apenas informações mínimas (id)
 * @param expiresIn - ex: "7d"
 */
export const signRefreshToken = (
  payload: { id: string },
  expiresIn = '7d'
): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(getRefreshSecret())
}

/**
 * Verifica Access Token
 */
export const verifyAccessToken = async (
  token: string
): Promise<JwtUserPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret())
    return payload as JwtUserPayload
  } catch {
    return null
  }
}

/**
 * Verifica Refresh Token
 */
export const verifyRefreshToken = async (
  token: string
): Promise<{ id: string } | null> => {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret())
    return payload as { id: string }
  } catch {
    return null
  }
}
