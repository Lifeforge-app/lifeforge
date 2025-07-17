import { ModuleWrapper } from 'lifeforge-ui'
import { memo } from 'react'

import Header from './components/Header'
import MapView from './components/Maps'

function RailwayMap() {
  return (
    <ModuleWrapper>
      <Header />
      <MapView />
    </ModuleWrapper>
  )
}

export default memo(RailwayMap)
