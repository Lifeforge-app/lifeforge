import React from 'react'

import { ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

function Workout(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:barbell" title="Workout" />
    </ModuleWrapper>
  )
}

export default Workout
