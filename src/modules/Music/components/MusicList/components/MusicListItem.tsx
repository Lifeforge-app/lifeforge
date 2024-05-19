import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { toast } from 'react-toastify'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import { useMusicContext } from '@providers/MusicProvider'
import { type IMusicEntry } from '@typedec/Music'
import forceDown from '../../../../../utils/forceDown'

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
    <tr key={music.id}>
      <td className="px-4 py-2">
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
      </td>
      <td className="w-2/4 px-4">
        <p className="w-96 min-w-0 truncate">{music.name}</p>
      </td>
      <td className="w-1/4 px-4 text-bg-500">
        <p className="w-96 min-w-0 truncate">{music.author}</p>
      </td>
      <td className="w-1/4 px-4 text-bg-500">
        {moment
          .utc(moment.duration(music.duration, 'seconds').asMilliseconds())
          .format('HH:mm:ss')}
      </td>
      <td>
        <div className="flex items-center">
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
              icon={
                !music.is_favourite ? 'tabler:heart' : 'tabler:heart-filled'
              }
              className="text-xl"
            />
          </button>
          <HamburgerMenu className="relative" largerPadding>
            <MenuItem
              onClick={() => {
                forceDown(
                  `${import.meta.env.VITE_API_HOST}/media/${
                    music.collectionId
                  }/${music.id}/${music.file}`,
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
      </td>
    </tr>
  )
}

export default MusicListItem
