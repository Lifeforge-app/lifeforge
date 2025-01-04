import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'

function MinecraftServerList(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Minecraft Server List" icon="tabler:cube" />
    </ModuleWrapper>
  )
}

export default MinecraftServerList
