import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Text } from '@lifeforge/ui'

function ChangeViewButton({
  view,
  currentView,
  onView
}: {
  view: string
  currentView: string
  onView: (view: 'month' | 'week' | 'day' | 'agenda' | 'work_week') => void
}) {
  const { t } = useModuleTranslation()

  const isActive = view.toLowerCase() === currentView

  return (
    <Box asChild r="md" shadow={isActive} width="100%">
      <Text
        truncate
        as="button"
        bg={isActive ? { base: 'bg-200', dark: 'bg-800' } : undefined}
        color={isActive ? { base: 'bg-800', dark: 'bg-200' } : 'muted'}
        p="sm"
        style={{
          transition: 'all 150ms',
          whiteSpace: 'nowrap'
        }}
        weight="medium"
        onClick={() => {
          onView(view.toLowerCase() as 'month' | 'week' | 'day' | 'agenda')
        }}
      >
        {t(`view.${_.camelCase(view)}`)}
      </Text>
    </Box>
  )
}

export default ChangeViewButton
