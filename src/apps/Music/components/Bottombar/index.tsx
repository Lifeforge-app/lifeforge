import ControlButtons from './components/ControlButtons'
import DurationSlider from './components/DurationSlider'
import MusicInfo from './components/MusicInfo'
import VolumeControl from './components/VolumeControl'

function BottomBar() {
  return (
    <div className="flex-between bg-bg-50 dark:bg-bg-900 absolute bottom-8 left-0 flex w-full flex-col gap-4 rounded-lg p-4 shadow-lg">
      <div className="flex-between flex w-full flex-col gap-4 md:flex-row md:gap-8">
        <MusicInfo />
        <ControlButtons />
        <VolumeControl />
      </div>
      <DurationSlider />
    </div>
  )
}

export default BottomBar
