import { useMusicContext } from '@/providers/MusicProvider'
import { ContextMenu, ContextMenuItem, FAB, useModalStore } from 'lifeforge-ui'

import YoutubeDownloaderModal from '../modals/YoutubeDownloaderModal'
import ControlButtons from './components/ControlButtons'
import DurationSlider from './components/DurationSlider'
import MusicInfo from './components/MusicInfo'
import VolumeControl from './components/VolumeControl'

function BottomBar() {
  const open = useModalStore(state => state.open)

  const { currentMusic } = useMusicContext()

  return (
    <div className="absolute bottom-8 left-0 w-full space-y-3">
      <ContextMenu
        buttonComponent={<FAB className="static!" visibilityBreakpoint="md" />}
        classNames={{
          wrapper: 'fixed bottom-6 right-6'
        }}
      >
        <ContextMenuItem
          icon="tabler:brand-youtube"
          label="Download from YouTube"
          namespace="apps.music"
          onClick={() => open(YoutubeDownloaderModal, {})}
        />
      </ContextMenu>
      {currentMusic !== null && (
        <div className="flex-between bg-bg-50 dark:bg-bg-900 flex w-full flex-col gap-3 rounded-lg p-4 shadow-lg">
          <div className="flex-between flex w-full flex-col gap-3 md:flex-row md:gap-8">
            <MusicInfo />
            <ControlButtons />
            <VolumeControl />
          </div>
          <DurationSlider />
        </div>
      )}
    </div>
  )
}

export default BottomBar
