import { Link, useNavigate } from '@tanstack/react-router'
import {
  BookMarked,
  BookOpen,
  ClipboardList,
  Clock,
  LogOut,
  Menu,
  RotateCcw,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { logoutApi } from '../../../shared/api'
import { InlineLoader } from '../../../shared/components/inline-loader'
import { ensureSession } from '../../router/guards'
import { ROUTES } from '../../../shared/constants/routes'
import { useAuthStore } from '../../../shared/store/auth.store'

export function AppHeader() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const hasTriedBootstrapRef = useRef(false)
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const sessionStatus = useAuthStore(state => state.sessionStatus)
  const clearSession = useAuthStore(state => state.clearSession)
  const setSessionStatus = useAuthStore(state => state.setSessionStatus)
  const isCheckingSession = sessionStatus === 'idle' || sessionStatus === 'checking'
  const isLoggedIn = Boolean(accessToken && user)

  useEffect(() => {
    if (accessToken && user) {
      hasTriedBootstrapRef.current = true
      setSessionStatus('authenticated')
      return
    }

    if (hasTriedBootstrapRef.current) {
      if (sessionStatus === 'idle') {
        setSessionStatus('unauthenticated')
      }
      return
    }

    hasTriedBootstrapRef.current = true

    let active = true
    let timeoutRef: ReturnType<typeof setTimeout> | null = null

    const bootstrapSession = async () => {
      setSessionStatus('checking')

      try {
        const ok = await Promise.race([
          ensureSession(),
          new Promise<boolean>(resolve => {
            timeoutRef = setTimeout(() => resolve(false), 8000)
          }),
        ])

        if (!ok && active) {
          clearSession()
        }
      } catch {
        if (active) {
          clearSession()
        }
      } finally {
        if (timeoutRef) {
          clearTimeout(timeoutRef)
        }

        if (active) {
          const { accessToken: finalToken, user: finalUser } = useAuthStore.getState()
          if (finalToken && finalUser) {
            setSessionStatus('authenticated')
          } else if (sessionStatus === 'checking' || sessionStatus === 'idle') {
            setSessionStatus('unauthenticated')
          }
        }
      }
    }

    void bootstrapSession()

    return () => {
      active = false
      if (timeoutRef) {
        clearTimeout(timeoutRef)
      }
    }
  }, [accessToken, user, clearSession, setSessionStatus, sessionStatus])

  const navLinks = [
    { to: ROUTES.VOCABULARY, icon: <BookMarked size={15} />, label: 'Từ vựng của tôi' },
    { to: ROUTES.REVIEW, icon: <RotateCcw size={15} />, label: 'Ôn tập' },
    { to: ROUTES.QUIZ, icon: <ClipboardList size={15} />, label: 'Kiểm tra' },
    { to: ROUTES.REVIEW_HISTORY, icon: <Clock size={15} />, label: 'Lịch sử ôn tập' },
    //{ to: ROUTES.ACCESS_TOKEN, icon: <KeyRound size={15} />, label: 'Access token' },
  ] as const

  const handleLogout = async () => {
    try {
      await logoutApi()
    } finally {
      clearSession()
      setMobileOpen(false)
      navigate({ to: ROUTES.LOGIN })
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/85 px-6 backdrop-blur-md md:px-10">
        <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
            <BookOpen size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="hidden text-lg font-extrabold tracking-tight text-zinc-900 sm:block">
            Dylan
            <span className="text-emerald-600"> Dictionary</span>
          </span>
        </Link>

        {isLoggedIn && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                activeProps={{ className: 'bg-emerald-50 text-emerald-700' }}
              >
                {icon}
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isCheckingSession ? (
            <InlineLoader text="Đang kiểm tra phiên..." />
          ) : isLoggedIn ? (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? 'Avatar'}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-100"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-zinc-700">{user?.name ?? user?.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition-all hover:bg-red-50 hover:text-red-600 md:flex"
              >
                <LogOut size={15} />
                <span>Đăng xuất</span>
              </button>

              <button
                onClick={() => setMobileOpen(prev => !prev)}
                className="rounded-lg p-2 text-zinc-500 transition-all hover:bg-zinc-100 md:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
                        <Link
                to={ROUTES.LOGIN}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-emerald-700"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </header>

      {isLoggedIn && mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div
            className="relative mx-3 mt-16 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? 'Avatar'}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-100"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm font-semibold text-zinc-800">{user?.name ?? user?.email}</span>
            </div>

            <nav className="py-2">
              {navLinks.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  activeProps={{ className: 'bg-emerald-50 text-emerald-700' }}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-zinc-100 py-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
