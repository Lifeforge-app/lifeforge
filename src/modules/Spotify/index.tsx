/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React, { useContext, useEffect } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { AuthContext } from '../../providers/AuthProvider'
import { Icon } from '@iconify/react/dist/iconify.js'
import WebPlayback from './WebPlayback'

function Spotify(): React.ReactElement {
  const { userData } = useContext(AuthContext)

  function loginWithSpotify(): void {
    window.location.href = `${
      import.meta.env.VITE_API_HOST
    }/spotify/auth/login/`
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-8 sm:px-12">
      <ModuleHeader
        title="Spotify"
        desc="Listen to your favourite music. Anywhere, anytime."
      />

      {userData?.spotifyAccessToken ? (
        <WebPlayback />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-12">
          <button
            onClick={loginWithSpotify}
            className="flex items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 dark:text-bg-800"
          >
            <Icon icon="tabler:brand-spotify" className="text-xl" />
            login with spotify
          </button>
        </div>
      )}
    </section>
  )
}

export default Spotify
