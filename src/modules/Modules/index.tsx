import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import ModuleWrapper from '../../components/general/ModuleWrapper'

function Modules(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Modules"
        desc="A place to toggle which modules you want to use."
      />
    </ModuleWrapper>
  )
}

export default Modules
