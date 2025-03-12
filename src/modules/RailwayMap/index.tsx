import React, { memo } from 'react'

import { ModuleWrapper } from '@lifeforge/ui'

import Header from './components/Header'
import MapView from './components/Maps'
import RoutePlannerModal from './components/RoutePlannerModal'
import RailwayMapProvider from './providers/RailwayMapProvider'

function RailwayMap(): React.ReactElement {
  return (
    <ModuleWrapper>
      <RailwayMapProvider>
        <Header />
        <MapView />
        <RoutePlannerModal />
      </RailwayMapProvider>
    </ModuleWrapper>
  )
}

export default memo(RailwayMap)
