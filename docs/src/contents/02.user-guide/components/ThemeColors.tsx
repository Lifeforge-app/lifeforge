import { Icon } from '@iconify/react'
import { usePersonalization } from 'shared'

function ThemeColors() {
  const { setRawThemeColor, rawThemeColor } = usePersonalization()

  return (
    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
      {[
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'blue',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'brown',
        'grey'
      ].map((color, index) => (
        <button
          key={index}
          className="flex flex-col items-center"
          onClick={() => {
            setRawThemeColor(`theme-${color}`)
          }}
        >
          <div
            className={`flex-center h-16 w-16 rounded-full theme-${color} bg-custom-500 transition-all ${
              rawThemeColor === `theme-${color}`
                ? 'ring-custom-500 ring-offset-bg-100 dark:ring-offset-bg-900 ring-3 ring-offset-3'
                : ''
            }`}
          >
            {rawThemeColor === `theme-${color}` ? (
              <Icon
                className="text-bg-100 dark:text-bg-900 size-8"
                icon="tabler:check"
              />
            ) : null}
          </div>
          <span className="mt-2 text-sm text-gray-500">{color}</span>
        </button>
      ))}
    </div>
  )
}

export default ThemeColors
