/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useSpotifyContext } from '@providers/SpotifyProvider'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'

function WebPlayback(): React.ReactElement {
  const { player, isPaused, isActive, currentTrack } = useSpotifyContext()
  const [position, setPosition] = useState('0:00')

  function getPlayDuration(): void {
    if (isActive) {
      player.getCurrentState().then((state: any) => {
        if (!state) {
          console.error(
            'User is not playing music through the Web Playback SDK'
          )
          return '0:00'
        }

        const { position } = state
        setPosition(position)
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getPlayDuration()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isActive, player])

  return isActive ? (
    <>
      <div className="flex h-full w-full flex-col items-center justify-between py-12">
        <div className="flex-center flex flex-1 flex-col ">
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
        <div className="flex-center mt-6 flex w-full flex-col gap-4">
          <div className="flex w-full flex-col">
            <div className="flex-center flex gap-6">
              <p className="hidden w-20 justify-end sm:flex">{`${Math.floor(
                Number(position) / 60000
              )}:${`${Math.floor((Number(position) % 60000) / 1000)}`.padStart(
                2,
                '0'
              )}`}</p>
              <input
                type="range"
                min="1"
                max={currentTrack.duration_ms}
                value={position}
                onChange={e => {
                  player.seek(Number(e.target.value))
                }}
                className="w-full sm:w-96"
                id="myRange"
              />
              <p className="hidden w-20 justify-start sm:flex">{`${Math.floor(
                currentTrack.duration_ms / 60000
              )}:${`${Math.floor(
                (currentTrack.duration_ms % 60000) / 1000
              )}`.padStart(2, '0')}`}</p>
            </div>
            <div className="flex w-full items-center justify-between sm:hidden">
              <p className="text-sm text-bg-500">
                {`${Math.floor(Number(position) / 60000)}:${`${Math.floor(
                  (Number(position) % 60000) / 1000
                )}`.padStart(2, '0')}`}
              </p>
              <p className="text-sm text-bg-500">
                {`${Math.floor(
                  currentTrack.duration_ms / 60000
                )}:${`${Math.floor(
                  (currentTrack.duration_ms % 60000) / 1000
                )}`.padStart(2, '0')}`}
              </p>
            </div>
          </div>
          <div className="flex-center flex gap-6">
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
                  ? 'bg-custom-500 text-bg-100 dark:text-bg-800'
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
