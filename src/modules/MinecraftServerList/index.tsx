import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function MinecraftServerList(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:cube" title="Minecraft Server List" />
    </ModuleWrapper>
  )
}

export default MinecraftServerList
