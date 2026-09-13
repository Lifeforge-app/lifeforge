import { memo } from 'react'
import type { View } from 'react-big-calendar'

import { Flex, surface } from '@lifeforge/ui'

import ChangeViewButton from './components/ChangeViewButton'

function ViewSelector({
  currentView,
  onView
}: {
  currentView: View
  onView: (view: View) => void
}) {
  return (
    <Flex
      shadow
      bg={surface.default}
      gap="xs"
      mb="md"
      p="sm"
      r="md"
      width="100%"
    >
      {['Month', 'Week', 'Day', 'Agenda'].map(view => (
        <ChangeViewButton
          key={view}
          currentView={currentView}
          view={view}
          onView={onView}
        />
      ))}
    </Flex>
  )
}

export default memo(ViewSelector)
