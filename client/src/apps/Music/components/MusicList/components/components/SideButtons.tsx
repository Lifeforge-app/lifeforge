import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import forceDown from '@utils/forceDown'
import clsx from 'clsx'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import UpdateMusicModal from '@apps/Music/modals/UpdateMusicModal'
import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import { IMusicEntry } from '../../../../interfaces/music_interfaces'

function SideButtons({ music }: { music: IMusicEntry }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { toggleFavourite } = useMusicContext()

  const handleUpdateEntry = useCallback(() => {
    open(UpdateMusicModal, {
      existedData: music
    })
  }, [music])

  const handleDeleteEntry = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'music/entries',
      data: music,
      itemName: 'music',
      nameKey: 'name',
      afterDelete: async () => {
        queryClient.invalidateQueries({
          queryKey: ['music', 'entries']
        })
      }
    })
  }, [music])

  return (
    <div className="flex w-auto min-w-0 shrink-0 items-center justify-end sm:w-2/12">
      <button
        className={clsx(
          'hover:bg-bg-100 dark:hover:bg-bg-800/50 rounded-lg p-4 transition-all',
          music.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        )}
        onClick={() => {
          toggleFavourite(music).catch(() => {})
        }}
      >
        <Icon
          className="text-xl"
          icon={!music.is_favourite ? 'tabler:heart' : 'tabler:heart-filled'}
        />
      </button>
      <HamburgerMenu>
        <MenuItem
          icon="tabler:download"
          text="Download"
          onClick={() => {
            forceDown(
              `${import.meta.env.VITE_API_HOST}/media/${music.collectionId}/${
                music.id
              }/${music.file}`,
              music.name
            )
          }}
        />
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={handleUpdateEntry}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteEntry}
        />
      </HamburgerMenu>
    </div>
  )
}

export default SideButtons
