import { DashboardItem, EmptyStateScreen } from 'lifeforge-ui'

function NotFoundWidget({ widgetId }: { widgetId: string }) {
  return (
    <DashboardItem icon="tabler:apps-off" title={widgetId}>
      <EmptyStateScreen
        name="notFound"
        namespace="apps.dashboard"
        smaller
        icon="tabler:apps-off"
      />
    </DashboardItem>
  )
}

export default NotFoundWidget
