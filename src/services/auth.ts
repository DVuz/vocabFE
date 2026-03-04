/// <reference types="vite/client" />

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  image: string;
  provider: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

/**
 * Gửi Google access_token lên backend để đổi lấy app JWT
 */
export async function loginWithGoogle(googleAccessToken: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: googleAccessToken }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? 'Đăng nhập thất bại');
  }

  const json: ApiResponse<AuthResponse> = await res.json();
  return json.data; // ← trích đúng tầng data
}
