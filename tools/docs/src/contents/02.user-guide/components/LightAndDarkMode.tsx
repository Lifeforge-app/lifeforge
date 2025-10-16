import { Icon } from '@iconify/react'
import { usePersonalization } from 'shared'

function LightAndDarkMode() {
  const { theme, setTheme } = usePersonalization()

  return (
    <div className="mt-6 flex w-full min-w-0">
      <div className="component-bg dark:bg-bg-800/50 shadow-custom w-full rounded-md p-4">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <h3 className="flex w-full items-center gap-2 text-left text-xl font-semibold">
            <Icon className="size-8" icon="tabler:sun-moon" />
            Light/Dark Theme Preview
          </h3>
          <div className="bg-bg-100 dark:bg-bg-800 flex w-full gap-1 rounded-md p-2 md:w-auto">
            <button
              className={`flex w-1/2 items-center justify-center gap-2 rounded-md p-2 pl-3 pr-4 font-medium ${
                theme === 'light'
                  ? 'bg-custom-500 text-bg-800'
                  : 'bg-bg-800 text-bg-400'
              }`}
              onClick={() => setTheme('light')}
            >
              <Icon className="h-5 w-5" icon="uil:sun" />
              Light
            </button>
            <button
              className={`flex w-1/2 items-center justify-center gap-2 rounded-md p-2 pl-3 pr-4 font-medium ${
                theme === 'dark' ? 'bg-custom-500 text-bg-800' : 'text-bg-400'
              }`}
              onClick={() => setTheme('dark')}
            >
              <Icon className="h-5 w-5" icon="uil:moon" />
              Dark
            </button>
          </div>
        </div>
        <img
          key={theme}
          alt=""
          className="mt-4 w-full rounded-md"
          src={`/assets/colors/${theme}.png`}
        />
      </div>
    </div>
  )
}

export default LightAndDarkMode
