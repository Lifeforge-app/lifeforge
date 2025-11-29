import { EmptyStateScreen, Widget } from 'lifeforge-ui'

function NotFoundWidget({ widgetId }: { widgetId: string }) {
  return (
    <Widget icon="tabler:apps-off" title={widgetId}>
      <EmptyStateScreen
        smaller
        icon="tabler:apps-off"
        message={{
          id: 'notFound',
          namespace: 'apps.dashboard'
        }}
      />
    </Widget>
  )
}

export default NotFoundWidget
