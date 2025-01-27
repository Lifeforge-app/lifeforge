import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function MinecraftServerList(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Minecraft Server List" icon="tabler:cube" />
    </ModuleWrapper>
  )
}

export default MinecraftServerList
