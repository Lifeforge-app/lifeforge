import React from 'react'

import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function NutritionsTracker(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:leaf" title="Nutritions Tracker" />
    </ModuleWrapper>
  )
}

export default NutritionsTracker
