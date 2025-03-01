import { Icon } from '@iconify/react'
import clsx from 'clsx'

import React from 'react'
import { useTranslation } from 'react-i18next'

const COLORS = ['bg-slate', 'bg-gray', 'bg-zinc', 'bg-neutral', 'bg-stone']

function DefaultBgTempSelector({
  bgTemp,
  setBgTemp
}: {
  bgTemp: string
  setBgTemp: (value: string) => void
}): React.ReactElement {
  const { t } = useTranslation('modules.personalization')

  return (
    <div className="flex w-full flex-col items-center gap-2 xl:w-auto">
      <div className="flex items-center gap-4">
        {COLORS.map((color, index) => (
          <button
            key={index}
            className={clsx(
              'flex size-8 items-center justify-center rounded-full bg-bg-500 ring-offset-2 ring-offset-bg-50 transition-all dark:ring-offset-bg-950',
              color,
              bgTemp === color
                ? 'ring-2 ring-bg-500'
                : 'hover:ring-2 hover:ring-bg-500'
            )}
            onClick={() => {
              setBgTemp(color)
            }}
          >
            {bgTemp === color && (
              <Icon
                className="size-4 text-bg-50 dark:text-bg-800"
                icon="tabler:check"
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex-between flex w-full gap-2">
        <span className="shrink-0 text-sm font-medium text-bg-500">
          {t('bgTempSelector.cool')}
        </span>
        <span className="mt-px h-0.5 w-full bg-linear-to-r from-blue-500 to-red-500"></span>
        <span className="shrink-0 text-sm font-medium text-bg-500">
          {t('bgTempSelector.warm')}
        </span>
      </div>
    </div>
  )
}

export default DefaultBgTempSelector
