import React from 'react'
import ControlButtons from './components/ControlButtons'
import DurationSlider from './components/DurationSlider'
import MusicInfo from './components/MusicInfo'
import VolumeControl from './components/VolumeControl'

function BottomBar(): React.ReactElement {
  return (
    <div className="absolute bottom-4 left-0 flex w-full flex-col flex-between gap-4 rounded-lg bg-bg-50 p-4 shadow-lg dark:bg-bg-900">
      <div className="flex w-full flex-col flex-between gap-4 md:flex-row md:gap-8">
        <MusicInfo />
        <ControlButtons />
        <VolumeControl />
      </div>
      <DurationSlider />
    </div>
  )
}

export default BottomBar
