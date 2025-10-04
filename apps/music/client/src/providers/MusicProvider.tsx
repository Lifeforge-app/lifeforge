import forgeAPI from '@/utils/forgeAPI'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'
import { useAuth } from 'shared'

export type MusicEntry = InferOutput<typeof forgeAPI.music.entries.list>[number]

interface IMusicContext {
  // Audio related
  audio: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  currentMusic: MusicEntry | null
  setCurrentMusic: React.Dispatch<React.SetStateAction<MusicEntry | null>>
  currentDuration: number
  setCurrentDuration: React.Dispatch<React.SetStateAction<number>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
  togglePlay: (music: MusicEntry) => Promise<void>
  playMusic: (music: MusicEntry) => Promise<void>
  stopMusic: () => void
  lastMusic: () => void
  nextMusic: () => void

  // Music list related
  musicsQuery: UseQueryResult<MusicEntry[]>

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
  const { auth } = useAuth()

  const audio = useRef(new Audio())

  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(false)

  const musicsQuery = useQuery(
    forgeAPI.music.entries.list.queryOptions({
      enabled: auth
    })
  )

  const [isPlaying, setIsPlaying] = useState(false)

  const [currentMusic, setCurrentMusic] = useState<MusicEntry | null>(null)

  const [currentDuration, setCurrentDuration] = useState(0)

  const [isShuffle, setIsShuffle] = useState(false)

  const [isRepeat, setIsRepeat] = useState(false)

  const [volume, setVolume] = useState(80)

  const playMusic = async (music: MusicEntry) => {
    setCurrentMusic(music)

    audio.current.src = forgeAPI.media.input({
      collectionId: music.collectionId,
      recordId: music.id,
      fieldId: music.file
    }).endpoint

    setCurrentDuration(0)
    setIsPlaying(true)
    await audio.current.play()
  }

  async function togglePlay(music: MusicEntry) {
    if (currentMusic?.id === music.id) {
      if (isPlaying) {
        audio.current.pause()
      } else {
        await audio.current.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      await playMusic(music)
    }
  }

  const stopMusic = () => {
    audio.current.pause()
    setCurrentDuration(0)
    setCurrentMusic(null)
    setIsPlaying(false)
  }

  const lastMusic = () => {
    if (!musicsQuery.data) return

    if (isShuffle) {
      shuffleMusic()

      return
    }

    if (isRepeat) {
      if (currentMusic !== null) {
        playMusic(currentMusic).catch(err => {
          toast.error(`Failed to play music. Error: ${err}`)
        })
      }

      return
    }

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

    if (isShuffle) {
      shuffleMusic()

      return
    }

    if (isRepeat) {
      if (currentMusic !== null) {
        playMusic(currentMusic).catch(err => {
          toast.error(`Failed to play music. Error: ${err}`)
        })
      }

      return
    }

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
      setCurrentDuration(audio.current.currentTime)
    }

    audio.current.addEventListener('ended', onEnd)

    const interval = setInterval(updateDuration, 1000)

    return () => {
      audio.current.removeEventListener('ended', onEnd)
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
