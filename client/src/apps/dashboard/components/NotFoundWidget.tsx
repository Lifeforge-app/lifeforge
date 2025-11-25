import { DashboardItem, EmptyStateScreen } from 'lifeforge-ui'

function NotFoundWidget({ widgetId }: { widgetId: string }) {
  return (
    <DashboardItem icon="tabler:apps-off" title={widgetId}>
      <EmptyStateScreen
        smaller
        icon="tabler:apps-off"
        name="notFound"
        namespace="apps.dashboard"
      />
    </DashboardItem>
  )
}

export default NotFoundWidget
