/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import AppRouter from './Router'
import GlobalStateProvider from './providers/GlobalStateProvider'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './providers/AuthProvider'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <GlobalStateProvider>
        <AuthProvider>
          <div className="relative flex h-screen w-full overflow-hidden bg-neutral-200/50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            <AppRouter />
          </div>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="w-max"
          />
        </AuthProvider>
      </GlobalStateProvider>
    </BrowserRouter>
  )
}

export default App
