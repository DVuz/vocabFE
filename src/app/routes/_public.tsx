import { createFileRoute, Outlet } from '@tanstack/react-router'
// import { redirectIfAuth } from '@/app/router/guards'

export const Route = createFileRoute('/_public')({
  // beforeLoad: ({ context }) => redirectIfAuth(context.queryClient),
  component: () => <Outlet />,
})
