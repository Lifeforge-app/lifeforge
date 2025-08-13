import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Button, ContextMenuItem, useModalStore } from 'lifeforge-ui'

import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import YoutubeDownloaderModal from '../modals/YoutubeDownloaderModal'
import ControlButtons from './components/ControlButtons'
import DurationSlider from './components/DurationSlider'
import MusicInfo from './components/MusicInfo'
import VolumeControl from './components/VolumeControl'

function BottomBar() {
  const open = useModalStore(state => state.open)

  const { currentMusic } = useMusicContext()

  return (
    <div className="absolute bottom-8 left-0 w-full space-y-4">
      <Menu as="div" className="static z-50 float-right block md:hidden">
        <Button as={MenuButton} icon="tabler:plus" onClick={() => {}}></Button>
        <MenuItems
          transition
          anchor="top end"
          className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:6px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        >
          <ContextMenuItem
            icon="tabler:brand-youtube"
            namespace="apps.music"
            text="Download from YouTube"
            onClick={() => open(YoutubeDownloaderModal, {})}
          />
        </MenuItems>
      </Menu>
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
