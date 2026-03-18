import { create } from 'zustand'

const ACCESS_TOKEN_STORAGE_KEY = 'access_token'

function persistAccessToken(token: string | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

function restoreAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export interface AuthUser {
  id: number
  email: string
  name?: string | null
  image?: string | null
  role?: string
  provider?: string
  status?: string
}

export type SessionStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated'

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  sessionStatus: SessionStatus
  setSession: (payload: { accessToken: string; user: AuthUser }) => void
  setUser: (user: AuthUser | null) => void
  setAccessToken: (token: string | null) => void
  setSessionStatus: (status: SessionStatus) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(set => ({
  accessToken: restoreAccessToken(),
  user: null,
  sessionStatus: 'idle',
  setSession: ({ accessToken, user }) => {
    persistAccessToken(accessToken)
    set({
      accessToken,
      user,
      sessionStatus: 'authenticated',
    })
  },
  setUser: user =>
    set(state => ({
      user,
      sessionStatus: state.accessToken && user ? 'authenticated' : state.sessionStatus,
    })),
  setAccessToken: token => {
    persistAccessToken(token)
    set(state => ({
      accessToken: token,
      sessionStatus: token && state.user ? 'authenticated' : state.sessionStatus,
    }))
  },
  setSessionStatus: sessionStatus => set({ sessionStatus }),
  clearSession: () => {
    persistAccessToken(null)
    set({
      accessToken: null,
      user: null,
      sessionStatus: 'unauthenticated',
    })
  },
}))
