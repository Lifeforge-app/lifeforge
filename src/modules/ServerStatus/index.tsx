import React from 'react'

import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

import APIEnvironment from './components/APIEnvironment'
import SystemInfo from './components/SystemInfo'
import SystemStatus from './components/SystemStatus'

function ServerStatus(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:server" title="Server Status" />
      <APIEnvironment />
      <SystemStatus />
      <SystemInfo />
    </ModuleWrapper>
  )
}

export default ServerStatus
