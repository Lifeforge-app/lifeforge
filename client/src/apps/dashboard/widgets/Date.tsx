import clsx from 'clsx'
import dayjs from 'dayjs'
import { usePersonalization } from 'shared'
import type { WidgetConfig } from 'shared'
import tinycolor from 'tinycolor2'

import { arabicToChinese } from '../utils/arabicToChineseNumber'

export default function DateWidget({
  dimension: { h }
}: {
  dimension: { w: number; h: number }
}) {
  const { language, derivedThemeColor: themeColor } = usePersonalization()

  return (
    <div
      className={clsx(
        'bg-custom-500 shadow-custom flex size-full gap-3 rounded-lg p-4',
        tinycolor(themeColor).isLight() ? 'text-bg-800' : 'text-bg-50',
        h < 2 ? 'flex-row items-end' : 'flex-col items-start justify-end'
      )}
    >
      <span
        className={clsx(
          'bg-bg-100 text-custom-500 dark:bg-bg-900 flex aspect-square h-full items-center justify-center rounded-md text-4xl font-semibold shadow-inner'
        )}
      >
        {dayjs().format('DD')}
      </span>
      <div className="flex w-full min-w-0 flex-col gap-1">
        <span className="text-2xl font-semibold">
          {dayjs().locale(language).format('dddd')}
        </span>
        <span className="w-full min-w-0 truncate">
          {dayjs()
            .locale(language)
            .format(language.startsWith('zh') ? 'YYYY[年] MMMM' : 'MMMM YYYY')}
          ,{' '}
          {(() => {
            switch (language) {
              case 'zh-CN':
              case 'zh-TW':
                return `第${arabicToChinese(
                  `${dayjs().week()}`,
                  language.endsWith('-CN') ? 'simplified' : 'traditional'
                )}${language.endsWith('-CN') ? '周' : '週'}`
              case 'ms':
                return dayjs().week() < 4
                  ? `Minggu ${
                      ['pertama', 'kedua', 'ketiga'][dayjs().week() - 1]
                    }`
                  : `Minggu ke-${dayjs().week()}`
              default:
                return `Week ${dayjs().week()}`
            }
          })()}
        </span>
      </div>
    </div>
  )
}

export const config: WidgetConfig = {
  id: 'date',
  icon: 'tabler:calendar-clock',
  minW: 2,
  minH: 1,
  maxW: 4,
  maxH: 2
}
