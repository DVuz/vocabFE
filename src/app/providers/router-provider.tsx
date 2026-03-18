import { RouterProvider as TanstackRouterProvider } from '@tanstack/react-router'
import { router } from '../router/router'

export function RouterProvider() {
  return <TanstackRouterProvider router={router} />
}
