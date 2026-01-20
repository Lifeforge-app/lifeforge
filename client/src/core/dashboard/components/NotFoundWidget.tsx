import {
  Button,
  ConfirmationModal,
  EmptyStateScreen,
  Widget,
  useModalStore
} from 'lifeforge-ui'
import { type IDashboardLayout, usePersonalization } from 'shared'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

function NotFoundWidget({
  widgetId,
  dimension: { h, w }
}: {
  widgetId: string
  dimension: { w: number; h: number }
}) {
  const { open } = useModalStore()

  const { dashboardLayout: enabledWidgets } = usePersonalization()

  const { changeDashboardLayout: setDashboardLayout } = useUserPersonalization()

  async function removeWidget() {
    const newEnabledWidgets = Object.fromEntries(
      Object.entries(
        JSON.parse(JSON.stringify(enabledWidgets)) as IDashboardLayout
      ).map(([k, value]) => [k, value.filter(i => i.i !== widgetId)])
    )

    if (Object.values(newEnabledWidgets).every(e => e.length === 0)) {
      setDashboardLayout({})
    } else {
      setDashboardLayout(newEnabledWidgets)
    }
  }

  function handleRemoveClick() {
    open(ConfirmationModal, {
      title: 'Are you sure you want to remove this widget?',
      description:
        'This action cannot be undone. The widget will be removed from your dashboard.',
      onConfirm: removeWidget
    })
  }

  return (
    <Widget
      actionComponent={
        <Button
          dangerous
          icon="tabler:trash"
          variant="plain"
          onClick={handleRemoveClick}
        />
      }
      icon="tabler:apps-off"
      title={widgetId}
    >
      {h > 1 && w > 1 && (
        <EmptyStateScreen
          smaller
          icon={h > 2 ? 'tabler:apps-off' : ''}
          message={{
            id: 'notFound',
            namespace: 'common.dashboard'
          }}
        />
      )}
    </Widget>
  )
}

export default NotFoundWidget
