import React from 'react'

import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

function Workout(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:barbell" title="Workout" />
    </ModuleWrapper>
  )
}

export default Workout
