/// <reference types="vite/client" />

import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/auth';
import { loginWithGoogle } from '../services/auth';

export const Route = createFileRoute('/login')({
  component: Login,
});

const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Dylan Dictionary';
const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE ?? 'Tra từ thông minh, học từ hiệu quả';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: data => {
      login(data.user, data.access_token);
      navigate({ to: '/' });
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    // flow: 'implicit' trả về access_token ngay trên FE (không cần backend verify)
    // flow: 'auth-code' trả về code để backend đổi lấy token (bảo mật hơn)
    flow: 'implicit',
    onSuccess: tokenResponse => {
      // Với implicit flow, tokenResponse.access_token là Google access token
      // Gửi lên backend để verify và đổi app JWT
      mutate(tokenResponse.access_token);
    },
    onError: () => console.error('Google login failed'),
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left panel: Brand ───────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-center gap-6 px-10 py-16 md:w-1/2
                      bg-linear-to-br from-emerald-50 via-green-50 to-teal-50
                      border-b md:border-b-0 md:border-r border-emerald-100"
      >
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

        {/* Logo badge */}
        <div
          className="relative z-10 flex items-center justify-center w-24 h-24 rounded-2xl
                        bg-emerald-500 shadow-xl shadow-emerald-200"
        >
          <BookOpen size={46} className="text-white" strokeWidth={1.5} />
        </div>

        {/* App name */}
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700">{APP_NAME}</h1>
          <p className="mt-2 text-sm text-emerald-500 font-medium tracking-wide">{APP_TAGLINE}</p>
        </div>

        {/* Feature chips */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-2 max-w-xs">
          {['📖 Tra từ tức thì', '🔖 Lưu từ vựng', '📊 Theo dõi tiến độ'].map(f => (
            <span
              key={f}
              className="px-3 py-1.5 text-sm rounded-full font-medium
                         bg-white/80 border border-emerald-200 text-emerald-700
                         shadow-sm backdrop-blur-sm"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel: Login form ──────────────────────────── */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">Đăng nhập</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Đăng nhập để sử dụng đầy đủ tính năng
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={isPending}
            className="group w-full flex items-center justify-center gap-3 px-5 py-3
                       border border-border rounded-xl bg-white
                       shadow-sm hover:shadow-md hover:border-emerald-300 hover:bg-emerald-50/50
                       transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin text-emerald-600" />
            ) : (
              <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
            )}
            <span className="font-semibold text-sm text-foreground group-hover:text-emerald-700 transition-colors">
              {isPending ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
            </span>
          </button>

          {/* Error message */}
          {isError && (
            <p className="mt-3 text-center text-xs text-red-500">
              {(error as Error)?.message ?? 'Đăng nhập thất bại, thử lại nhé!'}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">hoặc</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email placeholder */}
          <button
            disabled
            className="w-full py-3 px-5 rounded-xl text-sm font-semibold
                       bg-primary text-primary-foreground opacity-40 cursor-not-allowed"
          >
            Đăng nhập bằng Email · Sắp ra mắt
          </button>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Chính sách bảo mật
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
