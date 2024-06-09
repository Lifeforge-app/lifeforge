/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthProvider'

interface ISpotifyData {
  player: any
  isPaused: boolean
  isActive: boolean
  currentTrack: any
}

const SpotifyContext = createContext<ISpotifyData | undefined>(undefined)

export default function SpotifyProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { userData, auth } = useAuthContext()
  const track = {
    name: '',
    album: {
      images: [{ url: '' }]
    },
    artists: [{ name: '' }]
  }

  async function refreshToken(): Promise<void> {
    if (
      userData?.spotifyTokenExpires &&
      new Date(userData?.spotifyTokenExpires) < new Date()
    ) {
      const res = await fetch(
        `${import.meta.env.VITE_API_HOST}/spotify/auth/refresh`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(async res => await res.json())

      userData.spotifyAccessToken = res.accessToken
      userData.spotifyRefreshToken = res.refreshToken
      userData.spotifyTokenExpires = res.expires
    }
  }

  // async function fetchWebApi(
  //   endpoint: string,
  //   method: string,
  //   body?: string
  // ): Promise<any> {
  //   await refreshToken()

  //   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
  //     headers: {
  //       Authorization: `Bearer ${userData?.spotifyAccessToken}`
  //     },
  //     method,
  //     body: body ? JSON.stringify(body) : undefined
  //   })
  //   return await res.json()
  // }

  const [player, setPlayer] = useState<any>(undefined)
  const [isPaused, setPaused] = useState(true)
  const [isActive, setActive] = useState(false)
  const [currentTrack, setTrack] = useState(track)

  useEffect(() => {
    if (!auth) {
      if (player) {
        player.disconnect()
        setPlayer(undefined)
        setActive(false)
        setPaused(true)
        setTrack(track)
      }
      return
    }

    if (userData?.spotifyAccessToken && !player) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true

      document.body.appendChild(script)

      // @ts-expect-error This is external script so ;-;
      window.onSpotifyWebPlaybackSDKReady = async () => {
        await refreshToken()
        // @ts-expect-error This is external script so ;-;
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: (cb: any) => {
            cb(userData.spotifyAccessToken)
          },
          volume: 0.5
        })

        setPlayer(player)

        player.addListener('ready', ({ device_id }: { device_id: string }) => {
          console.log('Ready with Device ID', device_id)
        })

        player.addListener(
          'not_ready',
          ({ device_id }: { device_id: string }) => {
            console.log('Device ID has gone offline', device_id)
          }
        )

        player.addListener('player_state_changed', (state: any) => {
          if (!state) {
            return
          }

          setTrack(state.track_window.current_track)
          setPaused(state.paused)

          player.getCurrentState().then((state: any) => {
            !state ? setActive(false) : setActive(true)
          })
        })

        player.setName('LifeForge.')

        player.connect()
      }
    }
  }, [userData, auth])

  return (
    <SpotifyContext
      value={{
        player,
        isPaused,
        isActive,
        currentTrack
      }}
    >
      {children}
    </SpotifyContext>
  )
}

export function useSpotifyContext(): ISpotifyData {
  const context = useContext(SpotifyContext)
  if (context === undefined) {
    throw new Error('useSpotifyContext must be used within a SpotifyProvider')
  }
  return context
}
