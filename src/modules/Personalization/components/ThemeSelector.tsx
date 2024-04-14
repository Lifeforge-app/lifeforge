import React, { useContext } from 'react'
import { PersonalizationContext } from '@providers/PersonalizationProvider'
import { Icon } from '@iconify/react/dist/iconify.js'

function ThemeSelector(): React.ReactElement {
  const { theme, setTheme } = useContext(PersonalizationContext)

  return (
    <div className="mt-4 w-full">
      <h3 className="mt-6 block text-xl font-medium leading-normal">Theme</h3>
      <p className="text-neutral-500">Select or customize your UI theme.</p>
      <div className="mt-6 flex w-full flex-col gap-8 px-2 md:flex-row">
        {[
          { name: 'System', Image: '/assets/mockup/system.png' },
          { name: 'Light', Image: '/assets/mockup/light.png' },
          { name: 'Dark', Image: '/assets/mockup/dark.png' }
        ].map(({ name, Image }) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setTheme(name.toLowerCase() as 'system' | 'light' | 'dark')
            }}
            className="flex-1"
          >
            <div
              className={`ring-2 ring-offset-8 ring-offset-neutral-50 dark:ring-offset-neutral-900 ${
                theme === name.toLowerCase()
                  ? 'ring-custom-500'
                  : 'ring-neutral-200 dark:ring-neutral-700'
              } relative overflow-hidden rounded-lg lg:rounded-2xl`}
            >
              {theme === name.toLowerCase() && (
                <Icon
                  icon="tabler:circle-check-filled"
                  className="absolute bottom-2 right-2.5 block h-6 w-6 text-xl text-custom-500"
                />
              )}
              <img src={Image} alt={name} className="w-full" />
            </div>
            <p
              className={`mt-4 ${
                theme === name.toLowerCase() && 'font-medium text-custom-500'
              }`}
            >
              {name}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector
