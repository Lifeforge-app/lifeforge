import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import { QueryWrapper } from 'lifeforge-ui'
import tinycolor from 'tinycolor2'

import useAPIQuery from '@hooks/useAPIQuery'

export default function Quotes() {
  const quoteQuery = useAPIQuery<
    {
      q: string
      a: string
    }[]
  >('cors-anywhere?url=https://zenquotes.io/api/random', ['quote'])
  const { derivedThemeColor: themeColor } = usePersonalization()

  return (
    <div className="bg-custom-500 shadow-custom relative flex size-full flex-col items-center justify-center gap-2 rounded-lg p-6">
      <Icon
        className="text-bg-800/10 absolute top-2 right-2 text-8xl"
        icon="tabler:quote"
      />
      <Icon
        className="text-bg-800/10 absolute bottom-2 left-2 rotate-180 text-8xl"
        icon="tabler:quote"
      />
      <QueryWrapper query={quoteQuery}>
        {quote => (
          <div
            className={clsx(
              'text-center text-xl font-medium',
              tinycolor(themeColor).isLight() ? 'text-bg-800' : 'text-bg-50'
            )}
          >
            {quote[0].q}
            <br />
            <span className="mt-4 block text-base">- {quote[0].a}</span>
          </div>
        )}
      </QueryWrapper>
    </div>
  )
}
