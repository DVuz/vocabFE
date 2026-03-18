import axios from 'axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiErrorBody } from './api.type'
import { useAuthStore } from '../store/auth.store'

interface TimedRequestConfig extends InternalAxiosRequestConfig {
	meta?: {
		startedAt: number
	}
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000)
export const httpClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: API_TIMEOUT,
	withCredentials: true,
})

export function getAccessToken() {
	return useAuthStore.getState().accessToken
}

export function setAccessToken(token: string | null) {
	useAuthStore.getState().setAccessToken(token)
}

function logDuration(config: InternalAxiosRequestConfig | undefined, status?: number) {
	if (!config || !import.meta.env.DEV) {
		return
	}

	const timedConfig = config as TimedRequestConfig
	const startedAt = timedConfig.meta?.startedAt

	if (!startedAt) {
		return
	}

	const duration = Math.round(performance.now() - startedAt)
	const method = (config.method ?? 'GET').toUpperCase()
	const url = config.url ?? ''

	console.info(`[API] ${method} ${url} -> ${status ?? 'ERR'} (${duration}ms)`)
}

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const timedConfig = config as TimedRequestConfig
	timedConfig.meta = {
		startedAt: performance.now(),
	}

	const token = getAccessToken()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

httpClient.interceptors.response.use(
	response => {
		logDuration(response.config, response.status)
		return response
	},
	error => {
		if (axios.isAxiosError(error)) {
			logDuration(error.config, error.response?.status)
		}

		return Promise.reject(error)
	},
)

export function toApiError(error: unknown): ApiError {
	const fallback: ApiError = {
		status: 500,
		message: 'Unexpected error. Please try again.',
		raw: error,
	}

	if (!axios.isAxiosError(error)) {
		return fallback
	}

	const axiosError = error as AxiosError<ApiErrorBody>
	const status = axiosError.response?.status ?? 500
	const body = axiosError.response?.data

	return {
		status,
		message: body?.message ?? axiosError.message ?? fallback.message,
		code: body?.code,
		errors: body?.errors,
		raw: error,
	}
}

async function resolve<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
	try {
		const response = await request
		return response.data
	} catch (error) {
		throw toApiError(error)
	}
}

export function apiGet<TResponse>(
	url: string,
	config?: AxiosRequestConfig,
): Promise<TResponse> {
	return resolve<TResponse>(httpClient.get<TResponse>(url, config))
}

export function apiPost<TResponse, TBody = unknown>(
	url: string,
	body?: TBody,
	config?: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
	return resolve<TResponse>(httpClient.post<TResponse>(url, body, config))
}

export function apiPut<TResponse, TBody = unknown>(
	url: string,
	body?: TBody,
	config?: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
	return resolve<TResponse>(httpClient.put<TResponse>(url, body, config))
}

export function apiPatch<TResponse, TBody = unknown>(
	url: string,
	body?: TBody,
	config?: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
	return resolve<TResponse>(httpClient.patch<TResponse>(url, body, config))
}

export function apiDelete<TResponse>(
	url: string,
	config?: AxiosRequestConfig,
): Promise<TResponse> {
	return resolve<TResponse>(httpClient.delete<TResponse>(url, config))
}
