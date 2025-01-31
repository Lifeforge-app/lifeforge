import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function Budgets(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Budgets" icon="tabler:calculator" />
    </ModuleWrapper>
  )
}

export default Budgets
