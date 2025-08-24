import { Button, ContextMenu, ContextMenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import YoutubeDownloaderModal from './modals/YoutubeDownloaderModal'

function AddMusicButton() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.music')

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
      classNames={{ wrapper: 'hidden md:block' }}
    >
      <ContextMenuItem
        icon="tabler:brand-youtube"
        label="Download from Youtube"
        namespace="apps.music"
        onClick={handleYoutubeDownloaderOpen}
      />
    </ContextMenu>
  )
}

export default AddMusicButton
