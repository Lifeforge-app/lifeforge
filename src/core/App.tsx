// App.tsx
import React from 'react'
import Providers from '../core/Providers.tsx'
import AppRouter from '../core/Router.tsx'

function App(): React.ReactElement {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

export default App
