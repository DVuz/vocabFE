import { redirect } from '@tanstack/react-router'
import { getMe, refreshAccessToken } from '../../shared/api'
import { useAuthStore } from '../../shared/store/auth.store'

let refreshPromise: Promise<string> | null = null
let mePromise: ReturnType<typeof getMe> | null = null

export async function ensureSession() {
  const { accessToken, user, setAccessToken, setUser, setSessionStatus, clearSession } = useAuthStore.getState()

  setSessionStatus('checking')

  try {
    let activeAccessToken = accessToken

    if (!activeAccessToken) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }

      activeAccessToken = await refreshPromise
      setAccessToken(activeAccessToken)
    }

    if (!user) {
      if (!mePromise) {
        mePromise = getMe()
      }

      const me = await mePromise
      setUser(me)
    }

    setSessionStatus('authenticated')

    return true
  } catch {
    clearSession()
    setSessionStatus('unauthenticated')
    return false
  } finally {
    refreshPromise = null
    mePromise = null
  }
}

export async function requireAuth() {
  const ok = await ensureSession()

  if (!ok) {
    throw redirect({ to: '/login' })
  }
}

export async function requireGuest() {
  const ok = await ensureSession()

  if (ok) {
    throw redirect({ to: '/' })
  }
}
