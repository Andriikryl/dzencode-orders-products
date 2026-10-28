import { signSession, verifySession } from '../utils/jwt'

const COOKIE_NAME = 'session_token'

export default defineEventHandler(async (event) => {
  const existing = getCookie(event, COOKIE_NAME)

  if (existing) {
    const session = await verifySession(existing)

    if (!session) {
      deleteCookie(event, COOKIE_NAME, { path: '/' })
      throw createError({ statusCode: 401, statusMessage: 'Invalid session token' })
    }

    event.context.user = session
    return
  }

  const user = { sub: `guest-${Date.now()}`, name: 'Guest' }
  const token = await signSession(user)

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  event.context.user = user
})
