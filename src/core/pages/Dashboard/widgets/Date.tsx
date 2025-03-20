/* eslint-disable react-compiler/react-compiler */
import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRef } from 'react'
import tinycolor from 'tinycolor2'

import { arabicToChinese } from '../utils/arabicToChineseNumber'

export default function DateWidget() {
  const { language, themeColor } = usePersonalization()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-custom-500 shadow-custom flex size-full gap-4 rounded-lg p-4',
        tinycolor(themeColor).isLight() ? 'text-bg-800' : 'text-bg-50',
        (ref.current?.offsetHeight ?? 0) < 240
          ? 'flex-row items-end'
          : 'flex-col items-start justify-end'
      )}
    >
      <span
        className={clsx(
          'bg-bg-100 text-custom-500 dark:bg-bg-900 flex aspect-square items-center justify-center rounded-md font-semibold shadow-inner',
          (ref.current?.offsetHeight ?? 0) < 160
            ? 'h-full text-4xl'
            : 'p-8 text-6xl'
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
