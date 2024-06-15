import moment from 'moment/min/moment-with-locales'
import React, { useRef } from 'react'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { arabicToChinese } from '@utils/strings'

export default function Date(): React.ReactElement {
  const { language } = usePersonalizationContext()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={`flex size-full gap-4 rounded-lg bg-custom-500 p-4 text-bg-900 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] ${
        (ref.current?.offsetHeight ?? 0) < 240
          ? 'flex-row items-end'
          : 'flex-col items-start justify-end'
      }`}
    >
      <span
        className={`flex aspect-square items-center justify-center rounded-md bg-bg-100 ${
          (ref.current?.offsetHeight ?? 0) < 160
            ? 'h-full text-4xl'
            : 'p-8 text-6xl'
        } font-semibold text-custom-500 shadow-inner dark:bg-bg-900`}
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
          {language.startsWith('zh')
            ? `第${arabicToChinese(
                `${moment().week()}`,
                language.endsWith('-CN') ? 'simplified' : 'traditional'
              )}${language.endsWith('-CN') ? '周' : '週'}`
            : language === 'ms'
            ? moment().week() < 4
              ? `Minggu ${['pertama', 'kedua', 'ketiga'][moment().week() - 1]}`
              : `Minggu ke-${moment().week()}`
            : `Week ${moment().week()}`}
        </span>
      </div>
    </div>
  )
}
