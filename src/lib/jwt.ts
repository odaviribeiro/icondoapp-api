import { jwtVerify, SignJWT, JWTPayload } from 'jose'
import { JwtUserPayload } from '../modules/auth/types'

const getSecret = (): Uint8Array => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

/**
 * Gera um JWT para o payload do usuário.
 * @param payload - Dados do usuário a serem incluídos no token
 * @param expiresIn - Tempo de expiração (default 1 dia)
 * @returns token JWT assinado
 */
export const signJwt = (payload: JwtUserPayload, expiresIn = '1d'): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

/**
 * Verifica e decodifica um JWT.
 * @param token - Token a ser verificado
 * @returns payload tipado ou null se inválido
 */
export const verifyJwt = async (token: string): Promise<JwtUserPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as JwtUserPayload
  } catch {
    return null
  }
}
