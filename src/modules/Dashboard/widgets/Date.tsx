import clsx from 'clsx'
import moment from 'moment/min/moment-with-locales'
import React, { useRef } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { isLightColor } from '@utils/colors'
import { arabicToChinese } from '@utils/strings'

export default function DateWidget(): React.ReactElement {
  const { language } = usePersonalizationContext()
  const { theme } = useThemeColors()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-custom-500 shadow-custom flex size-full gap-4 rounded-lg p-4',
        isLightColor(theme) ? 'text-bg-800' : 'text-bg-50',
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
        {moment().format('DD')}
      </span>
      <div className="flex w-full min-w-0 flex-col gap-1">
        <span className="text-2xl font-semibold">
          {moment().locale(language).format('dddd')}
        </span>
        <span className="w-full min-w-0 truncate">
          {moment()
            .locale(language)
            .format(language.startsWith('zh') ? 'YYYY[年] MMMM' : 'MMMM YYYY')}
          ,{' '}
          {(() => {
            switch (language) {
              case 'zh-CN':
              case 'zh-TW':
                return `第${arabicToChinese(
                  `${moment().week()}`,
                  language.endsWith('-CN') ? 'simplified' : 'traditional'
                )}${language.endsWith('-CN') ? '周' : '週'}`
              case 'ms':
                return moment().week() < 4
                  ? `Minggu ${
                      ['pertama', 'kedua', 'ketiga'][moment().week() - 1]
                    }`
                  : `Minggu ke-${moment().week()}`
              default:
                return `Week ${moment().week()}`
            }
          })()}
        </span>
      </div>
    </div>
  )
}
