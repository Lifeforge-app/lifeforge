// App.tsx
import React from 'react'
import { ToastContainer } from 'react-toastify'
import Providers from './Providers'
import AppRouter from './Router'

function App(): React.ReactElement {
  return (
    <Providers>
      <div className="relative flex h-dvh w-full overflow-hidden bg-bg-200/50 text-bg-800 dark:bg-bg-950 dark:text-bg-100">
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
    </Providers>
  )
}

export default App
