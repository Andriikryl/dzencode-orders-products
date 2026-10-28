import { SignJWT, jwtVerify } from 'jose'

export interface SessionPayload {
  sub: string
  name: string
}

const TOKEN_TTL = '7d'

function secret(): Uint8Array {
  const value = process.env.JWT_SECRET || 'dzencode-dev-secret-change-me'
  return new TextEncoder().encode(value)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ name: payload.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secret())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (typeof payload.sub !== 'string') return null
    return { sub: payload.sub, name: String(payload.name ?? 'Guest') }
  } catch {
    return null
  }
}
