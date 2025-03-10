import React, { memo } from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import RailwayMapProvider from '@providers/RailwayMapProvider'
import Header from './components/Header'
import MapView from './components/Maps'
import RoutePlanner from './components/RoutePlanner'

function RailwayMap(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader icon="uil:subway" title="Railway Map" />
      <RailwayMapProvider>
        <Header />
        <RoutePlanner />
        <MapView />
      </RailwayMapProvider>
    </ModuleWrapper>
  )
}

export default memo(RailwayMap)
