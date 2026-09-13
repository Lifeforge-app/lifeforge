import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from '@lifeforge/ui'

import YoutubeDownloaderModal from './modals/YoutubeDownloaderModal'

function AddMusicButton() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const handleYoutubeDownloaderOpen = useCallback(() => {
    open(YoutubeDownloaderModal, {})
  }, [])

  return (
    <ContextMenu
      buttonComponent={
        <Button
          icon="tabler:plus"
          tProps={{ item: t('items.music') }}
          onClick={() => {}}
        >
          new
        </Button>
      }
      display={{ base: 'none', md: 'block' }}
    >
      <ContextMenuItem
        icon="tabler:brand-youtube"
        label="Download from Youtube"
        onClick={handleYoutubeDownloaderOpen}
      />
    </ContextMenu>
  )
}

export default AddMusicButton
