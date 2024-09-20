// App.tsx
import React from 'react'
import Providers from './Providers'
import AppRouter from './Router'

function App(): React.ReactElement {
  return (
    <main
      id="app"
      className="relative flex h-dvh w-full overflow-hidden bg-bg-200/50 text-bg-800 dark:bg-bg-950 dark:text-bg-50"
    >
      <Providers>
        <AppRouter />
      </Providers>
    </main>
  )
}

export default App
