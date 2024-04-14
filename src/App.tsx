/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import AppRouter from './Router'
import GlobalStateProvider from '@providers/GlobalStateProvider'
import { ToastContainer } from 'react-toastify'
import AuthProvider from '@providers/AuthProvider'
import PersonalizationProvider from '@providers/PersonalizationProvider'
import SpotifyProvider from '@providers/SpotifyProvider'

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <GlobalStateProvider>
        <AuthProvider>
          <PersonalizationProvider>
            <SpotifyProvider>
              <div className="relative flex h-[100dvh] w-full overflow-hidden bg-bg-200/50 text-bg-800 dark:bg-bg-950 dark:text-bg-100">
                <AppRouter />
              </div>
              <ToastContainer
                position="bottom-center"
                autoClose={3000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </SpotifyProvider>
          </PersonalizationProvider>
        </AuthProvider>
      </GlobalStateProvider>
    </BrowserRouter>
  )
}

export default App
