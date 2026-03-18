import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryProvider } from './query-provider'
import { RouterProvider } from './router-provider'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? 'missing-google-client-id'

export function AppProvider() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </GoogleOAuthProvider>
  )
}
