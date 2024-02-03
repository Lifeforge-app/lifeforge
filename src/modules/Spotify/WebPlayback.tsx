/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useContext } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { SpotifyContext } from '../../providers/SpotifyProvider'
import EmptyStateScreen from '../../components/general/EmptyStateScreen'

function WebPlayback(): React.ReactElement {
  const { player, isPaused, isActive, currentTrack } =
    useContext(SpotifyContext)

  return isActive ? (
    <>
      <div className="flex h-full w-full flex-col items-center justify-between py-12">
        <div className="flex flex-col items-center justify-center ">
          {currentTrack.album.images[0].url && (
            <img
              src={currentTrack.album.images[0].url}
              className="aspect-square h-64 w-64 rounded-lg sm:h-80 sm:w-80"
              alt=""
            />
          )}
          <div className="mt-6 text-center text-4xl font-medium">
            {currentTrack.name}
          </div>
          <div className="mt-2 text-center text-lg text-bg-500">
            {currentTrack.artists[0].name}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => {
              player.previousTrack()
            }}
            className="rounded-full p-4 hover:bg-bg-200/50 dark:hover:bg-bg-900"
          >
            <Icon icon="tabler:player-skip-back-filled" className="text-xl" />
          </button>
          <button
            onClick={() => {
              player.togglePlay()
            }}
            className={`rounded-full p-4 ${
              isPaused
                ? 'bg-custom-500 text-bg-100 dark:text-bg-900'
                : 'bg-bg-200 dark:bg-bg-700/50'
            }`}
          >
            <Icon
              icon={isPaused ? 'tabler:player-play-filled' : 'tabler:pause'}
              className="text-2xl"
            />
          </button>
          <button
            onClick={() => {
              player.nextTrack()
            }}
            className="rounded-full p-4 hover:bg-bg-200/50 dark:hover:bg-bg-900"
          >
            <Icon
              icon="tabler:player-skip-forward-filled"
              className="text-xl"
            />
          </button>
        </div>
      </div>
    </>
  ) : (
    <>
      <EmptyStateScreen
        icon="tabler:music-off"
        title="Device Not Connected"
        description="Head to any Spotify client and connect to this device to start playing music"
      />
    </>
  )
}

export default WebPlayback
