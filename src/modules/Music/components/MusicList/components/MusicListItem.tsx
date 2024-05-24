import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { toast } from 'react-toastify'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { useMusicContext } from '@providers/MusicProvider'
import { type IMusicEntry } from '@typedec/Music'
import forceDown from '@utils/forceDown'

function MusicListItem({ music }: { music: IMusicEntry }): React.ReactElement {
  const {
    currentMusic,
    isPlaying,
    togglePlay,
    toggleFavourite,
    setIsModifyMusicModalOpen,
    setExistedData,
    setIsDeleteMusicConfirmationModalOpen
  } = useMusicContext()

  return (
    <div className="flex w-full min-w-0 items-center py-2">
      <div className="flex w-full min-w-0 items-center gap-2 sm:w-7/12 sm:shrink-0 lg:w-5/12">
        <button
          onClick={() => {
            togglePlay(music).catch(err => {
              toast.error(`Failed to play music. Error: ${err}`)
            })
          }}
          className={`rounded-lg p-4 transition-all ${
            currentMusic?.id === music.id
              ? isPlaying
                ? 'animate-spin text-custom-500'
                : 'text-bg-100'
              : 'text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100'
          }`}
        >
          <Icon
            icon={
              currentMusic?.id === music.id
                ? isPlaying
                  ? 'tabler:disc'
                  : 'tabler:pause'
                : 'tabler:play'
            }
            className="text-xl"
          />
        </button>
        <div className="w-full min-w-0">
          <p className="w-full min-w-0 truncate">{music.name}</p>
          <p className="block w-full min-w-0 truncate text-sm text-bg-500 md:hidden">
            {music.author} <span className="text-bg-500">•</span>{' '}
            {moment
              .utc(moment.duration(music.duration, 'seconds').asMilliseconds())
              .format(+music.duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}
          </p>
        </div>
      </div>
      <div className="hidden w-3/12 min-w-0 text-bg-500 lg:block">
        <p className="w-96 min-w-0 truncate">{music.author}</p>
      </div>
      <div className="hidden w-3/12 min-w-0 text-bg-500 sm:block lg:w-2/12">
        {moment
          .utc(moment.duration(music.duration, 'seconds').asMilliseconds())
          .format(+music.duration >= 3600 ? 'HH:mm:ss' : 'mm:ss')}
      </div>
      <div className="flex w-auto min-w-0 shrink-0 items-center justify-end sm:w-2/12">
        <button
          onClick={() => {
            toggleFavourite(music).catch(() => {})
          }}
          className={`rounded-lg p-4 ${
            music.is_favourite
              ? 'text-red-500 hover:text-red-600'
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
          } transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800/50`}
        >
          <Icon
            icon={!music.is_favourite ? 'tabler:heart' : 'tabler:heart-filled'}
            className="text-xl"
          />
        </button>
        <HamburgerMenu className="relative" largerPadding>
          <MenuItem
            onClick={() => {
              forceDown(
                `${import.meta.env.VITE_API_HOST}/media/${music.collectionId}/${
                  music.id
                }/${music.file}`,
                music.name
              )
            }}
            icon="tabler:download"
            text="Download"
          />
          <MenuItem
            onClick={() => {
              setIsModifyMusicModalOpen(true)
              setExistedData(music)
            }}
            icon="tabler:pencil"
            text="Edit"
          />
          <MenuItem
            onClick={() => {
              setExistedData(music)
              setIsDeleteMusicConfirmationModalOpen(true)
            }}
            icon="tabler:trash"
            text="Delete"
            isRed
          />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default MusicListItem
