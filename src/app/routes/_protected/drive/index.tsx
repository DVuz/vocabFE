import { createFileRoute } from '@tanstack/react-router'
import { DrivePage } from '../../../../features/drive/components/drive-page'

export const Route = createFileRoute('/_protected/drive/')({
  component: DrivePage,
})
