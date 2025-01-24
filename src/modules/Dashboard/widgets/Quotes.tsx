import { Icon } from '@iconify/react'
import React from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { isLightColor } from '@utils/colors'

export default function Quotes(): React.ReactElement {
  const [quote] = useFetch<string>('quotes')
  const { theme } = useThemeColors()

  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-2 rounded-lg bg-custom-500 p-6 shadow-custom">
      <Icon
        icon="tabler:quote"
        className="absolute right-2 top-2 text-8xl text-bg-800/10"
      />
      <Icon
        icon="tabler:quote"
        className="absolute bottom-2 left-2 rotate-180 text-8xl text-bg-800/10"
      />
      <APIFallbackComponent data={quote}>
        {quote => (
          <div
            className={`text-center text-xl font-medium ${
              isLightColor(theme) ? 'text-bg-800' : 'text-bg-50'
            }`}
          >
            {quote}
          </div>
        )}
      </APIFallbackComponent>
    </div>
  )
}
