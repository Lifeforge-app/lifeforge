import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { useUserPersonalization } from '../../../../../../providers/UserPersonalizationProvider'

const COLORS = ['bg-slate', 'bg-gray', 'bg-zinc', 'bg-neutral', 'bg-stone']

function DefaultBgTempSelector({ bgTemp }: { bgTemp: string }) {
  const { t } = useTranslation('apps.personalization')

  const { changeBgTemp } = useUserPersonalization()

  return (
    <div className="flex w-full flex-col items-center gap-2 xl:w-auto">
      <div className="flex items-center gap-3">
        {COLORS.map((color, index) => (
          <button
            key={index}
            className={clsx(
              'bg-bg-500 ring-offset-bg-50 dark:ring-offset-bg-950 flex size-8 items-center justify-center rounded-full ring-offset-2 transition-all',
              color,
              bgTemp === color
                ? 'ring-bg-500 ring-2'
                : 'hover:ring-bg-500 hover:ring-2'
            )}
            onClick={() => {
              changeBgTemp(color)
            }}
          >
            {bgTemp === color && (
              <Icon
                className="text-bg-50 dark:text-bg-800 size-4"
                icon="tabler:check"
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex-between flex w-full gap-2">
        <span className="text-bg-500 shrink-0 text-sm font-medium">
          {t('bgTempSelector.cool')}
        </span>
        <span className="mt-px h-0.5 w-full bg-linear-to-r from-blue-500 to-red-500"></span>
        <span className="text-bg-500 shrink-0 text-sm font-medium">
          {t('bgTempSelector.warm')}
        </span>
      </div>
    </div>
  )
}

export default DefaultBgTempSelector
