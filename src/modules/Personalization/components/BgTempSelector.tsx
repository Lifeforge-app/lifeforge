import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

const COLORS = ['bg-slate', 'bg-gray', 'bg-zinc', 'bg-neutral', 'bg-stone']

function BgTempSelector(): React.ReactElement {
  const { bgTemp, setBgTemp } = usePersonalizationContext()
  const { t } = useTranslation()

  return (
    <ConfigColumn
      title={t('personalization.bgTempSelector.title')}
      desc={t('personalization.bgTempSelector.desc')}
      icon="tabler:temperature"
    >
      <div className="flex w-full flex-col items-center gap-2 md:w-auto">
        <div className="flex items-center gap-4">
          {COLORS.map((color, index) => (
            <button
              key={index}
              className={`flex size-8 items-center justify-center rounded-full ${color} bg-bg-500 ring-offset-2 ring-offset-bg-50 transition-all dark:ring-offset-bg-950 ${
                bgTemp === color
                  ? 'ring-2 ring-bg-500'
                  : 'hover:ring-2 hover:ring-bg-500'
              }`}
              onClick={() => {
                setBgTemp(color)
              }}
            >
              {bgTemp === color && (
                <Icon
                  icon="tabler:check"
                  className="size-4 text-bg-50 dark:text-bg-800"
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex-between flex w-full gap-2">
          <span className="shrink-0 text-sm font-medium text-bg-500">
            {t('personalization.bgTempSelector.cool')}
          </span>
          <span className="mt-px h-0.5 w-full bg-gradient-to-r from-blue-500 to-red-500"></span>
          <span className="shrink-0 text-sm font-medium text-bg-500">
            {t('personalization.bgTempSelector.warm')}
          </span>
        </div>
      </div>
    </ConfigColumn>
  )
}

export default BgTempSelector
