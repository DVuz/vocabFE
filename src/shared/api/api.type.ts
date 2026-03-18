export type FieldErrors = Record<string, string[]>

export interface ApiMeta {
	requestId?: string
	timestamp?: string
}

export interface PaginationMeta {
	page: number
	pageSize: number
	total: number
	totalPages: number
	hasNext?: boolean
	hasPrev?: boolean
}

export interface ApiResponse<TData> {
	success: boolean
	statusCode: number
	data: TData
	message: string
	pagination?: PaginationMeta
	meta?: ApiMeta
}

export interface ApiListResponse<TItem> {
	data: TItem[]
	pagination: PaginationMeta
	message?: string
	meta?: ApiMeta
}

export interface ApiErrorBody {
	message?: string
	code?: string
	errors?: FieldErrors
}

export interface ApiError {
	status: number
	message: string
	code?: string
	errors?: FieldErrors
	raw?: unknown
}
