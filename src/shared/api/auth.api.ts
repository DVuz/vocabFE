import { apiGet, apiPost, type ApiResponse } from './index'
import type { AuthUser } from '../store/auth.store'

export interface GoogleLoginRequest {
  code: string
  redirect_uri: string
  codeVerifier?: string
}

interface GoogleLoginData {
  user: AuthUser
  accessToken?: string
  access_token?: string
}

interface RefreshData {
  accessToken?: string
  access_token?: string
}

export interface GoogleLoginResult {
  user: AuthUser
  accessToken: string
}

export async function loginWithGoogle(
  payload: GoogleLoginRequest,
): Promise<GoogleLoginResult> {
  const response = await apiPost<ApiResponse<GoogleLoginData>, GoogleLoginRequest>(
    '/auth/google',
    payload,
  )

  const accessToken = response.data.accessToken ?? response.data.access_token

  if (!accessToken) {
    throw new Error('Không nhận được access token từ máy chủ')
  }

  return {
    user: response.data.user,
    accessToken,
  }
}

export async function logoutApi() {
  return apiPost<ApiResponse<null>>('/auth/logout')
}

export async function refreshAccessToken() {
  const response = await apiPost<ApiResponse<RefreshData>>('/auth/refresh')
  const accessToken = response.data.accessToken ?? response.data.access_token

  if (!accessToken) {
    throw new Error('Không nhận được access token khi refresh')
  }

  return accessToken
}

export async function getMe() {
  const response = await apiGet<ApiResponse<AuthUser>>('/auth/me')
  return response.data
}
