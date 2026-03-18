import { create } from 'zustand'

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
  accessToken: null,
  user: null,
  sessionStatus: 'idle',
  setSession: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
      sessionStatus: 'authenticated',
    }),
  setUser: user =>
    set(state => ({
      user,
      sessionStatus: state.accessToken && user ? 'authenticated' : state.sessionStatus,
    })),
  setAccessToken: token =>
    set(state => ({
      accessToken: token,
      sessionStatus: token && state.user ? 'authenticated' : state.sessionStatus,
    })),
  setSessionStatus: sessionStatus => set({ sessionStatus }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      sessionStatus: 'unauthenticated',
    }),
}))
