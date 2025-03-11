// App.tsx
import React from 'react'

import Providers from './Providers.tsx'
import AppRouter from './Router.tsx'

function App(): React.ReactElement {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

export default App
