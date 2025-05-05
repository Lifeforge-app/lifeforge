import { memo } from 'react'

import { ModuleWrapper } from '@lifeforge/ui'

import useModalsEffect from '../../core/modals/useModalsEffect'
import Header from './components/Header'
import MapView from './components/Maps'
import { RailwayMapModals } from './modals'

function RailwayMap() {
  useModalsEffect(RailwayMapModals)

  return (
    <ModuleWrapper>
      <Header />
      <MapView />
    </ModuleWrapper>
  )
}

export default memo(RailwayMap)
