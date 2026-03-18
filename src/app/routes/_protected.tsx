import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireAuth } from '../router/guards'

export const Route = createFileRoute('/_protected')({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
})
