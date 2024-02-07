import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import ModuleWrapper from '../../components/general/ModuleWrapper'

function Settings(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Settings" desc="Configure your application here." />
    </ModuleWrapper>
  )
}

export default Settings