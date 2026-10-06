import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../../shared/store/auth.store'
import { fetchDriveContent, fetchDriveTree } from '../api/drive.api'

export function useDriveTree() {
  const isLoggedIn = Boolean(useAuthStore(state => state.accessToken))
  return useQuery({
    queryKey: ['drive-tree'],
    queryFn: fetchDriveTree,
    enabled: isLoggedIn,
  })
}

export function useDriveContent(fileId: string) {
  const isLoggedIn = Boolean(useAuthStore(state => state.accessToken))
  return useQuery({
    queryKey: ['drive-content', fileId],
    queryFn: () => fetchDriveContent(fileId),
    enabled: isLoggedIn && Boolean(fileId),
  })
}
