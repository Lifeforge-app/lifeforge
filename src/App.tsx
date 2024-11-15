// App.tsx
import React from 'react'
import Providers from './Providers.tsx'
import AppRouter from './Router.tsx'

function App(): React.ReactElement {
  return (
    <div className="relative flex h-dvh w-full overflow-hidden">
      <Providers>
        <AppRouter />
      </Providers>
    </div>
  )
}

export default App
