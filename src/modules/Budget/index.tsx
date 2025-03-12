import React from 'react'

import { ModuleWrapper } from '@lifeforge/ui'
import { ModuleHeader } from '@lifeforge/ui'

function Budgets(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:calculator" title="Budgets" />
    </ModuleWrapper>
  )
}

export default Budgets
