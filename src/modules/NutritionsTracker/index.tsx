import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function NutritionsTracker(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Nutritions Tracker" icon="tabler:leaf" />
    </ModuleWrapper>
  )
}

export default NutritionsTracker
