// Providers.tsx
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import AuthProvider from '@providers/AuthProvider'
import GlobalStateProvider from '@providers/GlobalStateProvider'
import { MusicProvider } from '@providers/MusicProvider'
import PersonalizationProvider from '@providers/PersonalizationProvider'
import SpotifyProvider from '@providers/SpotifyProvider'

function Providers({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <GlobalStateProvider>
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <PersonalizationProvider>
            <MusicProvider>
              <SpotifyProvider>{children}</SpotifyProvider>
            </MusicProvider>
          </PersonalizationProvider>
        </AuthProvider>
      </DndProvider>
    </GlobalStateProvider>
  )
}

export default Providers
