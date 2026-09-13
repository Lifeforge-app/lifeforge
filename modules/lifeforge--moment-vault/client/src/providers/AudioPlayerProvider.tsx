import type { ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import type WaveSurfer from 'wavesurfer.js'

export interface AudioPlayerContextType {
  registerPlayer: (id: string, wavesurfer: WaveSurfer) => void
  unregisterPlayer: (id: string) => void
  pauseOthers: (currentId: string) => void
  currentActive: string | null
  setCurrentActive: (id: string | null) => void
  playbackSpeed: number
  setPlaybackSpeed: (speed: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const players = useRef<Map<string, WaveSurfer>>(new Map())
  const [currentActive, setCurrentActive] = useState<string | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)

  const registerPlayer = (id: string, wavesurfer: WaveSurfer) => {
    players.current.set(id, wavesurfer)
  }

  const unregisterPlayer = (id: string) => {
    players.current.delete(id)
  }

  const pauseOthers = (currentId: string) => {
    players.current.forEach((ws, id) => {
      if (id !== currentId && ws.isPlaying()) {
        ws.pause()
      }
    })
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        registerPlayer,
        unregisterPlayer,
        pauseOthers,
        currentActive,
        setCurrentActive,
        playbackSpeed,
        setPlaybackSpeed
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)

  if (context === undefined) {
    return {
      registerPlayer: () => {},
      unregisterPlayer: () => {},
      pauseOthers: () => {},
      currentActive: null,
      setCurrentActive: () => {},
      playbackSpeed: 1,
      setPlaybackSpeed: () => {}
    }
  }

  return context
}
