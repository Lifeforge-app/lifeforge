import RailwayMapProvider from '@providers/RailwayMapProvider'
import React, { memo } from 'react'

import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

import Header from './components/Header'
import MapView from './components/Maps'
import RoutePlannerModal from './components/RoutePlannerModal'

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
