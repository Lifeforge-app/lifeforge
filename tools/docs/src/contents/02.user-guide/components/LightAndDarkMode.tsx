import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react'

function LightAndDarkMode() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  return (
    <div className="mt-6 flex w-full min-w-0">
      <div className="bg-bg-800/50 w-full rounded-md p-4">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <h3 className="w-full text-left text-xl font-semibold">
            Light/Dark Theme Preview
          </h3>
          <div className="bg-bg-800 flex w-full gap-2 rounded-md md:w-auto">
            <button
              className={`flex w-1/2 items-center justify-center gap-1 rounded-md p-2 px-4 font-medium ${
                mode === 'light'
                  ? 'bg-custom-500 text-bg-800'
                  : 'bg-bg-800 text-bg-400'
              }`}
              onClick={() => setMode('light')}
            >
              <Icon className="h-5 w-5" icon="uil:sun" />
              Light
            </button>
            <button
              className={`flex w-1/2 items-center justify-center gap-1 rounded-md p-2 px-4 font-medium ${
                mode === 'dark'
                  ? 'bg-custom-500 text-bg-800'
                  : 'bg-bg-800 text-bg-400'
              }`}
              onClick={() => setMode('dark')}
            >
              <Icon className="h-5 w-5" icon="uil:moon" />
              Dark
            </button>
          </div>
        </div>
        <img
          key={mode}
          alt=""
          className="mt-4 w-full rounded-md"
          src={`/assets/colors/${mode}.png`}
        />
      </div>
    </div>
  )
}

export default LightAndDarkMode
