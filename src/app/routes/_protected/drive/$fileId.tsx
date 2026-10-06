import { createFileRoute } from '@tanstack/react-router'
import { DriveLessonPage } from '../../../../features/drive/components/drive-lesson-page'

export const Route = createFileRoute('/_protected/drive/$fileId')({
  component: DriveLessonRoute,
})

function DriveLessonRoute() {
  const { fileId } = Route.useParams()
  return <DriveLessonPage fileId={fileId} />
}
