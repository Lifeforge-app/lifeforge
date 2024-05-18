/* eslint-disable @typescript-eslint/no-misused-promises */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import DeleteConfirmationModal from '@components/DeleteConfirmationModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import useFetch from '@hooks/useFetch'
import { type IMusicEntry } from '@typedec/Music'
import YoutubeDownloaderModal from './YoutubeDownloaderModal'
import forceDown from '../../utils/forceDown'
import IntervalManager from '../../utils/intervalManager'

const intervalManager = IntervalManager.getInstance()

function Music(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [loading, setLoading] = useState(false)
  const [musics, refreshMusics, setMusics] =
    useFetch<IMusicEntry[]>('music/entry/list')
  const [isYoutubeDownloaderOpen, setIsYoutubeDownloaderOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMusic, setCurrentMusic] = useState<IMusicEntry | null>(null)
  const [currentDuration, setCurrentDuration] = useState(0)
  const [audio] = useState(new Audio())
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [volume, setVolume] = useState(80)
  const [existedData, setExistedData] = useState<IMusicEntry | null>(null)
  const [
    isDeleteMusicConfirmationModalOpen,
    setIsDeleteMusicConfirmationModalOpen
  ] = useState(false)

  function toggleFavourite(targetMusic: IMusicEntry): void {
    setMusics(prevMusics => {
      if (typeof prevMusics !== 'string') {
        return prevMusics.map(music => {
          if (music.id === targetMusic.id) {
            return { ...music, is_favourite: !music.is_favourite }
          }
          return music
        })
      }
      return prevMusics
    })

    fetch(
      `${import.meta.env.VITE_API_HOST}/music/entry/favourite/${
        targetMusic.id
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(res => {
        if (res.status === 200) {
          if (targetMusic.is_favourite) {
            toast.info('Music removed from favourites!')
          } else {
            toast.success('Music added to favourites!')
          }
          setCurrentMusic(prevMusic => {
            if (prevMusic !== null && prevMusic.id === targetMusic.id) {
              return { ...prevMusic, is_favourite: !prevMusic.is_favourite }
            }
            return prevMusic
          })
        } else {
          setMusics(prevMusics => {
            if (typeof prevMusics !== 'string') {
              return prevMusics.map(music => {
                if (music.id === targetMusic.id) {
                  return { ...music, is_favourite: !music.is_favourite }
                }
                return music
              })
            }
            return prevMusics
          })
          throw new Error('Failed to add music to favourites!')
        }
      })
      .catch(err => {
        setMusics(prevMusics => {
          if (typeof prevMusics !== 'string') {
            return prevMusics.map(music => {
              if (music.id === targetMusic.id) {
                return { ...music, is_favourite: !music.is_favourite }
              }
              return music
            })
          }
          return prevMusics
        })
        toast.error(`Oops! Couldn't add music to favourites! ${err}`)
      })
  }

  async function togglePlay(music: IMusicEntry): Promise<void> {
    if (currentMusic?.id === music.id) {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      setCurrentDuration(0)
      setCurrentMusic(music)
      audio.src = `${import.meta.env.VITE_API_HOST}/media/${
        music.collectionId
      }/${music.id}/${music.file}`
      await audio.play()
      setIsPlaying(true)
    }
  }

  function lastMusic(): void {
    if (typeof musics !== 'string') {
      const currentIndex = musics.findIndex(
        music => music.id === currentMusic?.id
      )
      if (currentIndex - 1 >= 0) {
        setCurrentMusic(musics[currentIndex - 1])
        audio.src = `${import.meta.env.VITE_API_HOST}/media/${
          musics[currentIndex - 1].collectionId
        }/${musics[currentIndex - 1].id}/${musics[currentIndex - 1].file}`
        setCurrentDuration(0)
        audio.play()
      }
    }
  }

  function nextMusic(): void {
    if (typeof musics !== 'string') {
      const currentIndex = musics.findIndex(
        music => music.id === currentMusic?.id
      )
      if (currentIndex + 1 < musics.length) {
        setCurrentMusic(musics[currentIndex + 1])
        audio.src = `${import.meta.env.VITE_API_HOST}/media/${
          musics[currentIndex + 1].collectionId
        }/${musics[currentIndex + 1].id}/${musics[currentIndex + 1].file}`
        setCurrentDuration(0)
        audio.play()
      } else {
        audio.pause()
        setCurrentDuration(0)
        setCurrentMusic(null)
        setIsPlaying(false)
      }
    }
  }

  function shuffleMusic(): void {
    if (typeof musics !== 'string') {
      const randomIndex = Math.floor(Math.random() * musics.length)
      setCurrentMusic(musics[randomIndex])
      audio.src = `${import.meta.env.VITE_API_HOST}/media/${
        musics[randomIndex].collectionId
      }/${musics[randomIndex].id}/${musics[randomIndex].file}`
      setCurrentDuration(0)
      audio.play()
    }
  }

  useEffect(() => {
    const onEnd = (): void => {
      if (isShuffle) {
        shuffleMusic()
      } else if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        nextMusic()
      }
    }

    const updateDuration = (): void => {
      setCurrentDuration(audio.currentTime)
    }

    audio.addEventListener('ended', onEnd)

    const interval = setInterval(updateDuration, 1000)

    return () => {
      audio.removeEventListener('ended', onEnd)
      clearInterval(interval)
    }
  }, [audio, musics, currentMusic, isShuffle, isRepeat])

  async function checkImportProgress(): Promise<
    'completed' | 'failed' | 'in_progress'
  > {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/music/entry/import-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data.status
    }
    return 'failed'
  }

  function importMusic(): void {
    setLoading(true)

    fetch(`${import.meta.env.VITE_API_HOST}/music/entry/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            intervalManager.setInterval(async () => {
              const success = await checkImportProgress()
              switch (success) {
                case 'completed':
                  toast.success('Music downloaded successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  refreshMusics()
                  break
                case 'failed':
                  toast.error('Failed to download music!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  break
              }
            }, 3000)
          }
        } else {
          const data = await res.json()
          setLoading(false)
          throw new Error(`Failed to download music. Error: ${data.message}`)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't download music! Error: ${err}`)
        setLoading(false)
      })
  }

  useEffect(() => {
    return () => {
      audio.pause()
    }
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Music"
        desc="..."
        actionButton={
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button CustomElement={Menu.Button} icon="tabler:plus">
              add music
            </Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              className="absolute right-0 top-8"
            >
              <Menu.Items className="mt-8 w-64 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
                <MenuItem
                  onClick={importMusic}
                  icon={loading ? 'svg-spinners:180-ring' : 'uil:import'}
                  text="Import from NAS"
                />
                <div className="w-full border-b border-bg-300 dark:border-bg-700" />
                <MenuItem
                  onClick={() => {
                    setIsYoutubeDownloaderOpen(true)
                  }}
                  icon="tabler:brand-youtube"
                  text="Download from YouTube"
                />
              </Menu.Items>
            </Transition>
          </Menu>
        }
      />
      <div className="relative flex h-full min-h-0 flex-col">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="musics"
        />
        <div className="relative h-full overflow-y-auto">
          <APIComponentWithFallback data={musics}>
            {typeof musics !== 'string' &&
            musics.filter(music =>
              music.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            ).length > 0 ? (
              <table className="mb-36 mt-6 w-full">
                <tbody className="divide-y divide-bg-800">
                  {musics
                    .filter(music =>
                      music.name
                        .toLowerCase()
                        .includes(debouncedSearchQuery.toLowerCase())
                    )
                    .map(music => (
                      <tr key={music.id}>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              togglePlay(music).catch(err => {
                                toast.error(
                                  `Failed to play music. Error: ${err}`
                                )
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
                        <td className="w-2/4 truncate px-4">{music.name}</td>
                        <td className="w-1/4 px-4 text-bg-500">
                          {music.author}
                        </td>
                        <td className="w-1/4 px-4 text-bg-500">
                          {moment
                            .utc(
                              moment
                                .duration(music.duration, 'seconds')
                                .asMilliseconds()
                            )
                            .format('HH:mm:ss')}
                        </td>
                        <td>
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                toggleFavourite(music)
                              }}
                              className={`rounded-lg p-4 ${
                                music.is_favourite
                                  ? 'text-red-500 hover:text-red-600'
                                  : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
                              } transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800/50`}
                            >
                              <Icon
                                icon={
                                  !music.is_favourite
                                    ? 'tabler:heart'
                                    : 'tabler:heart-filled'
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
                              <MenuItem icon="tabler:pencil" text="Edit" />
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
                    ))}
                </tbody>
              </table>
            ) : (
              <EmptyStateScreen
                title={
                  musics.length > 0
                    ? 'Oops! Nothing found here.'
                    : '"Oops! Nothing to see here."'
                }
                icon={
                  musics.length > 0 ? 'tabler:search-off' : 'tabler:music-off'
                }
                description={
                  musics.length > 0
                    ? "The search query that you entered doesn't seem to yield any result."
                    : 'Add the music by either downloading it or putting it into your NAS folder'
                }
                customCTAButton={
                  musics.length > 0 ? (
                    <Menu as="div" className="relative z-50 hidden md:block">
                      <Button CustomElement={Menu.Button} icon="tabler:plus">
                        add music
                      </Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        className="absolute left-1/2 top-8 -translate-x-1/2"
                      >
                        <Menu.Items className="mt-8 w-64 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
                          <MenuItem
                            onClick={importMusic}
                            icon={
                              loading ? 'svg-spinners:180-ring' : 'uil:import'
                            }
                            text="Import from NAS"
                          />
                          <div className="w-full border-b border-bg-300 dark:border-bg-700" />
                          <MenuItem
                            onClick={() => {
                              setIsYoutubeDownloaderOpen(true)
                            }}
                            icon="tabler:brand-youtube"
                            text="Download from YouTube"
                          />
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : undefined
                }
              />
            )}
          </APIComponentWithFallback>
        </div>
        {currentMusic !== null && (
          <div className="absolute bottom-4 left-0 flex w-full flex-col items-center justify-between gap-4 rounded-lg bg-bg-900 p-4 shadow-md">
            <div className="flex w-full items-center justify-between gap-8">
              <div className="flex w-1/3 min-w-0 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-custom-500/20">
                  <Icon
                    icon="tabler:disc"
                    className={`${
                      isPlaying ? 'animate-spin' : ''
                    } text-3xl text-custom-500`}
                  />
                </div>
                <div className="ml-4 min-w-0">
                  <p className="min-w-0 truncate font-semibold">
                    {currentMusic.name}
                  </p>
                  <p className="text-sm text-bg-500">{currentMusic.author}</p>
                </div>
              </div>
              <div className="flex w-1/3 items-center gap-2">
                <button
                  onClick={() => {
                    if (isShuffle) {
                      setIsShuffle(false)
                    } else {
                      setIsShuffle(true)
                      setIsRepeat(false)
                    }
                  }}
                  className={`rounded-lg p-4 ${
                    isShuffle
                      ? 'text-custom-500 hover:text-custom-600'
                      : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
                  } transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800`}
                >
                  <Icon icon="uil:shuffle" className="text-xl" />
                </button>
                <button
                  onClick={lastMusic}
                  className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
                >
                  <Icon icon="tabler:skip-back" className="text-xl" />
                </button>
                <button
                  onClick={() => {
                    togglePlay(currentMusic).catch(err => {
                      toast.error(`Failed to play music. Error: ${err}`)
                    })
                  }}
                  className="mx-2 rounded-full bg-bg-100 p-4 text-bg-800 transition-all hover:!bg-custom-500"
                >
                  <Icon
                    icon={
                      isPlaying
                        ? 'tabler:player-pause-filled'
                        : 'tabler:player-play-filled'
                    }
                    className="text-xl"
                  />
                </button>
                <button
                  onClick={nextMusic}
                  className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
                >
                  <Icon icon="tabler:skip-forward" className="text-xl" />
                </button>
                <button
                  onClick={() => {
                    if (isRepeat) {
                      setIsRepeat(false)
                    } else {
                      setIsRepeat(true)
                      setIsShuffle(false)
                    }
                  }}
                  className={`rounded-lg p-4 ${
                    isRepeat
                      ? 'text-custom-500 hover:text-custom-600'
                      : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
                  } transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800`}
                >
                  <Icon icon="uil:repeat" className="text-xl" />
                </button>
              </div>
              <div className="flex w-1/3 items-center justify-end gap-2">
                <button
                  className={`rounded-lg p-4 ${
                    currentMusic.is_favourite
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
                  } transition-all hover:bg-bg-200/50 dark:hover:bg-bg-800/50`}
                  onClick={() => {
                    toggleFavourite(currentMusic)
                  }}
                >
                  <Icon
                    icon={
                      currentMusic.is_favourite
                        ? 'tabler:heart-filled'
                        : 'tabler:heart'
                    }
                    className="text-xl"
                  />
                </button>
                <div className="flex items-center">
                  <Icon
                    icon="tabler:volume"
                    className="mr-4 text-xl text-bg-500"
                  />
                  <input
                    type="range"
                    onChange={e => {
                      audio.volume = +e.target.value / 100
                      setVolume(+e.target.value)
                    }}
                    className="secondary h-1 w-32 cursor-pointer overflow-hidden rounded-full bg-bg-700"
                    value={volume}
                    max="100"
                  ></input>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 text-sm">
              <span className="-mt-0.5 text-bg-500">
                {moment
                  .utc(
                    moment
                      .duration(+currentDuration, 'seconds')
                      .asMilliseconds()
                  )
                  .format(+currentDuration >= 3600 ? 'H:mm:ss' : 'm:ss')}
              </span>
              <input
                type="range"
                onChange={e => {
                  audio.currentTime = +e.target.value
                  setCurrentDuration(+e.target.value)
                }}
                className="main h-1 w-full cursor-pointer overflow-hidden rounded-full bg-bg-700"
                value={currentDuration}
                max={currentMusic.duration}
              ></input>
              <span className="-mt-0.5 text-bg-500">
                {moment
                  .utc(
                    moment
                      .duration(+currentMusic.duration, 'seconds')
                      .asMilliseconds()
                  )
                  .format(+currentMusic.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
              </span>
            </div>
          </div>
        )}
      </div>
      <YoutubeDownloaderModal
        isOpen={isYoutubeDownloaderOpen}
        onClose={() => {
          setIsYoutubeDownloaderOpen(false)
          refreshMusics()
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="music/entry/delete"
        data={existedData}
        isOpen={isDeleteMusicConfirmationModalOpen}
        itemName="music"
        onClose={() => {
          setIsDeleteMusicConfirmationModalOpen(false)
        }}
        updateDataList={refreshMusics}
        nameKey="name"
      />
    </ModuleWrapper>
  )
}

export default Music
