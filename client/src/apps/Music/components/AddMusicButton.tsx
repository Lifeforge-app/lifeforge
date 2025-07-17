import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Button, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import YoutubeDownloaderModal from '../modals/YoutubeDownloaderModal'

function AddMusicButton() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.music')

  const handleYoutubeDownloaderOpen = useCallback(() => {
    open(YoutubeDownloaderModal, {})
  }, [])

  return (
    <Menu as="div" className="relative z-50 hidden md:block">
      <Button
        as={MenuButton}
        icon="tabler:plus"
        tProps={{ item: t('items.music') }}
        onClick={() => {}}
      >
        new
      </Button>
      <MenuItems
        transition
        anchor="bottom end"
        className="bg-bg-100 dark:bg-bg-800 mt-2 w-64 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem
          icon="tabler:brand-youtube"
          namespace="apps.music"
          text="Download from YouTube"
          onClick={handleYoutubeDownloaderOpen}
        />
      </MenuItems>
    </Menu>
  )
}

export default AddMusicButton
