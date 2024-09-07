/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { useAuthContext } from '@providers/AuthProvider'
import WebPlayback from './WebPlayback'

function Spotify(): React.ReactElement {
  const { userData } = useAuthContext()

  function loginWithSpotify(): void {
    window.location.href = `${
      import.meta.env.VITE_API_HOST
    }/spotify/auth/login/`
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:brand-spotify"
        title="Spotify"
        desc="Listen to your favourite music. Anywhere, anytime."
      />

      {userData?.spotifyAccessToken ? (
        <WebPlayback />
      ) : (
        <div className="flex-center flex size-full flex-col gap-12">
          <Button onClick={loginWithSpotify} icon="tabler:brand-spotify">
            login with spotify
          </Button>
        </div>
      )}
    </ModuleWrapper>
  )
}

export default Spotify
