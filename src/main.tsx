import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './core/App'
import './core/i18n'

function Main(): React.ReactElement {
  return (
    <BrowserRouter>
      <main
        className="bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex h-dvh w-full overflow-hidden"
        id="app"
      >
        <App />
      </main>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />)
