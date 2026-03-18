import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '../../../shared/store/auth.store'

export const Route = createFileRoute('/_protected/access-token')({
  component: AccessTokenPage,
})

function AccessTokenPage() {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-semibold text-zinc-900">Access Token</h1>
      <p className="mt-2 text-sm text-zinc-600">Trang kiểm tra token hiện tại của phiên đăng nhập.</p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">User</p>
        <p className="mt-1 text-sm font-medium text-zinc-800">{user?.email ?? 'Chưa có user trong store'}</p>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Token</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-zinc-50 p-3 text-xs text-zinc-800">
          {accessToken ?? 'Không có access token'}
        </pre>
      </div>
    </main>
  )
}
