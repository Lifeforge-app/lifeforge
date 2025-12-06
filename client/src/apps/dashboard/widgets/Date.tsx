import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { useDivSize, usePersonalization } from 'shared'
import type { WidgetConfig } from 'shared'
import tinycolor from 'tinycolor2'

import { arabicToChinese } from '../utils/arabicToChineseNumber'

export default function DateWidget({
  dimension: { w, h }
}: {
  dimension: { w: number; h: number }
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { width } = useDivSize(containerRef)

  const { language, derivedThemeColor: themeColor } = usePersonalization()

  return (
    <div
      ref={containerRef}
      className={clsx(
        'bg-custom-500 shadow-custom flex size-full gap-3 rounded-lg p-4',
        tinycolor(themeColor).isLight() ? 'text-bg-800' : 'text-bg-50',
        h === 2
          ? 'flex-col items-start'
          : h === 1
            ? 'flex-row items-center min-[488px]:items-end'
            : 'flex-col items-start justify-end'
      )}
    >
      <span
        className={clsx(
          'bg-bg-100 text-custom-500 dark:bg-bg-900 flex items-center justify-center rounded-md font-semibold shadow-inner',
          w === 2
            ? 'p-2 text-2xl min-[300px]:p-4 min-[488px]:aspect-square min-[488px]:h-full min-[488px]:text-4xl'
            : 'aspect-square h-full text-4xl'
        )}
      >
        {dayjs().format('DD')}
      </span>
      <div className="flex w-full min-w-0 flex-col gap-1">
        <span
          className={clsx(
            'font-semibold',
            w === 2 && h === 1 ? 'text-lg min-[488px]:text-2xl' : 'text-2xl'
          )}
        >
          {dayjs()
            .locale(language)
            .format(width < 150 ? 'ddd' : 'dddd')}
        </span>
        <span
          className={clsx(
            'w-full min-w-0',
            w === 2 && h === 1 ? 'text-sm min-[488px]:text-base' : 'text-base'
          )}
        >
          {dayjs()
            .locale(language)
            .format(
              width > 180
                ? language.startsWith('zh')
                  ? 'YYYY[年] MMMM'
                  : 'MMMM YYYY'
                : 'MM/YYYY'
            )}
          <span
            className={clsx(h === 1 ? 'hidden min-[488px]:inline' : 'inline')}
          >
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
