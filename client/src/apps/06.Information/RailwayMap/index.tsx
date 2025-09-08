import { memo } from 'react'

import Header from './components/Header'
import MapView from './components/Maps'

function RailwayMap() {
  return (
    <>
      <Header />
      <MapView />
    </>
  )
}

export default memo(RailwayMap)
