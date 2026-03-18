import type { ReactNode } from 'react'
import { AppHeader } from './headers/app-header.tsx'
import { useRouterState } from '@tanstack/react-router';

interface AppShellProps {
  children: ReactNode
}
const ROUTES_WITHOUT_HEADER = ['/login']

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const showHeader = !ROUTES_WITHOUT_HEADER.includes(pathname);
  return (
    <div className="min-h-screen bg-zinc-50">
      {showHeader && <AppHeader />}
      <main>{children}</main>
    </div>
  )
}
