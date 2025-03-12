import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import APIEnvironment from './components/APIEnvironment'
import SystemInfo from './components/SystemInfo'
import SystemStatus from './components/SystemStatus'

function ServerStatus() {
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
