import { apiGet, type ApiResponse } from '../../../shared/api'
import type { DriveContent, DriveItem } from '../types/drive.types'

export async function fetchDriveTree() {
  const response = await apiGet<ApiResponse<DriveItem>>('/google-drive/tree')
  return response.data
}

export async function fetchDriveContent(fileId: string) {
  const response = await apiGet<ApiResponse<DriveContent>>(`/google-drive/files/${encodeURIComponent(fileId)}/content`)
  return response.data
}
