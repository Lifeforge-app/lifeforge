import {
  type UseQueryResult,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { parse as parseCookie } from 'cookie'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { toast } from 'react-toastify'

import { type IMusicEntry } from '@apps/Music/interfaces/music_interfaces'

import { useAuth } from '../../../core/providers/AuthProvider'

interface IMusicContext {
  // Audio related
  audio: HTMLAudioElement
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentMusic: IMusicEntry | null
  setCurrentMusic: React.Dispatch<React.SetStateAction<IMusicEntry | null>>
  currentDuration: number
  setCurrentDuration: React.Dispatch<React.SetStateAction<number>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
  togglePlay: (music: IMusicEntry) => Promise<void>
  playMusic: (music: IMusicEntry) => Promise<void>
  stopMusic: () => void
  lastMusic: () => void
  nextMusic: () => void

  // Music list related
  musicsQuery: UseQueryResult<IMusicEntry[]>
  toggleFavourite: (music: IMusicEntry) => Promise<void>

  // Search related
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>

  // Loading state
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>

  // Playback options
  isShuffle: boolean
  setIsShuffle: React.Dispatch<React.SetStateAction<boolean>>
  isRepeat: boolean
  setIsRepeat: React.Dispatch<React.SetStateAction<boolean>>
}

const MusicContext = createContext<IMusicContext | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { auth } = useAuth()

  const [audio] = useState(new Audio())

  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(false)

  const musicsQuery = useQuery(
    forgeAPI.music.entries.list.queryOptions({
      enabled: auth
    })
  )

  const [isPlaying, setIsPlaying] = useState(false)

  const [currentMusic, setCurrentMusic] = useState<IMusicEntry | null>(null)

  const [currentDuration, setCurrentDuration] = useState(0)

  const [isShuffle, setIsShuffle] = useState(false)

  const [isRepeat, setIsRepeat] = useState(false)

  const [volume, setVolume] = useState(80)

  const playMusic = async (music: IMusicEntry) => {
    setCurrentMusic(music)
    audio.src = forgeAPI.media.input({
      collectionId: music.collectionId,
      recordId: music.id,
      fieldId: music.file
    }).endpoint

    setCurrentDuration(0)
    setIsPlaying(true)
    await audio.play()
  }

  async function toggleFavourite(targetMusic: IMusicEntry) {
    queryClient.setQueryData<IMusicEntry[]>(
      ['music', 'entries'],
      prevMusics =>
        prevMusics?.map(music =>
          music.id === targetMusic.id
            ? { ...music, is_favourite: !music.is_favourite }
            : music
        ) ?? []
    )

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/music/entries/favourite/${
          targetMusic.id
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${parseCookie(document.cookie).session}`
          }
        }
      )

      if (response.status !== 200) {
        throw new Error('Failed to add music to favourites!')
      }

      if (targetMusic.is_favourite) {
        toast.info('Music removed from favourites!')
      } else {
        toast.success('Music added to favourites!')
      }

      setCurrentMusic(prevMusic =>
        prevMusic !== null && prevMusic.id === targetMusic.id
          ? { ...prevMusic, is_favourite: !prevMusic.is_favourite }
          : prevMusic
      )
    } catch (err) {
      queryClient.invalidateQueries({ queryKey: ['music', 'entries'] })
      toast.error(`Oops! Couldn't add music to favourites! ${err as string}`)
    }
  }

  async function togglePlay(music: IMusicEntry) {
    if (currentMusic?.id === music.id) {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      await playMusic(music)
    }
  }

  const stopMusic = () => {
    audio.pause()
    setCurrentDuration(0)
    setCurrentMusic(null)
    setIsPlaying(false)
  }

  const lastMusic = () => {
    if (!musicsQuery.data) return

    const currentIndex = musicsQuery.data.findIndex(
      music => music.id === currentMusic?.id
    )

    if (currentIndex - 1 >= 0) {
      playMusic(musicsQuery.data[currentIndex - 1]).catch(err => {
        toast.error(`Failed to play music. Error: ${err}`)
      })
    }
  }

  const nextMusic = () => {
    if (!musicsQuery.data) return

    const currentIndex = musicsQuery.data.findIndex(
      music => music.id === currentMusic?.id
    )

    if (currentIndex + 1 < musicsQuery.data.length) {
      playMusic(musicsQuery.data[currentIndex + 1]).catch(err => {
        toast.error(`Failed to play music. Error: ${err}`)
      })
    } else {
      stopMusic()
    }
  }

  const shuffleMusic = () => {
    if (!musicsQuery.data) return

    const randomIndex = Math.floor(Math.random() * musicsQuery.data.length)

    playMusic(musicsQuery.data[randomIndex]).catch(err => {
      toast.error(`Failed to play music. Error: ${err}`)
    })
  }

  useEffect(() => {
    const onEnd = () => {
      if (isShuffle) {
        shuffleMusic()
      } else if (isRepeat) {
        if (currentMusic !== null) {
          playMusic(currentMusic).catch(err => {
            toast.error(`Failed to play music. Error: ${err}`)
          })
        }
      } else {
        nextMusic()
      }
    }

    const updateDuration = () => {
      setCurrentDuration(audio.currentTime)
    }

    audio.addEventListener('ended', onEnd)

    const interval = setInterval(updateDuration, 1000)

    return () => {
      audio.removeEventListener('ended', onEnd)
      clearInterval(interval)
    }
  }, [audio, musicsQuery.data, currentMusic, isShuffle, isRepeat])

  const value = useMemo(
    () => ({
      // Audio related
      audio,
      isPlaying,
      setIsPlaying,
      currentMusic,
      setCurrentMusic,
      currentDuration,
      setCurrentDuration,
      volume,
      setVolume,
      togglePlay,
      playMusic,
      stopMusic,
      lastMusic,
      nextMusic,

      // Music list related
      musicsQuery,
      toggleFavourite,

      // Search related
      searchQuery,
      setSearchQuery,

      // Loading state
      loading,
      setLoading,

      // Playback options
      isShuffle,
      setIsShuffle,
      isRepeat,
      setIsRepeat
    }),
    [
      audio,
      isPlaying,
      currentMusic,
      currentDuration,
      volume,
      musicsQuery.data,
      searchQuery,
      loading,
      isShuffle,
      isRepeat
    ]
  )

  return <MusicContext value={value}>{children}</MusicContext>
}

export function useMusicContext(): IMusicContext {
  const context = useContext(MusicContext)

  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider')
  }

  return context
}
