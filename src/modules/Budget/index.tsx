import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function Budget(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Budget" icon="tabler:calculator" />
    </ModuleWrapper>
  )
}

export default Budget
