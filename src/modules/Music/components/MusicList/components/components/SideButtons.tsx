import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { IMusicEntry } from '@interfaces/music_interfaces'
import { useMusicContext } from '@providers/MusicProvider'
import forceDown from '@utils/forceDown'

function SideButtons({ music }: { music: IMusicEntry }): React.ReactElement {
  const {
    toggleFavourite,
    setIsModifyMusicModalOpen,
    setExistedData,
    setIsDeleteMusicConfirmationModalOpen
  } = useMusicContext()

  return (
    <div className="flex w-auto min-w-0 shrink-0 items-center justify-end sm:w-2/12">
      <button
        className={`rounded-lg p-4 ${
          music.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        } transition-all hover:bg-bg-100 dark:hover:bg-bg-800/50`}
        onClick={() => {
          toggleFavourite(music).catch(() => {})
        }}
      >
        <Icon
          className="text-xl"
          icon={!music.is_favourite ? 'tabler:heart' : 'tabler:heart-filled'}
        />
      </button>
      <HamburgerMenu largerPadding className="relative">
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
          onClick={() => {
            setIsModifyMusicModalOpen(true)
            setExistedData(music)
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setExistedData(music)
            setIsDeleteMusicConfirmationModalOpen(true)
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default SideButtons
