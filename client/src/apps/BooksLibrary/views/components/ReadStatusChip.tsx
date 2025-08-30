import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import type { BooksLibraryEntry } from '@apps/BooksLibrary/providers/BooksLibraryProvider'

function ReadStatusChip({ item }: { item: BooksLibraryEntry }) {
  const { t } = useTranslation('apps.booksLibrary')

  const { derivedThemeColor, language } = usePersonalization()

  if (item.read_status === 'unread') {
    return null
  }

  return (
    <span
      className={clsx(
        'mb-2 flex w-min items-center gap-1 rounded-full py-1 pr-3 pl-2.5 text-xs font-semibold tracking-wide whitespace-nowrap',
        item.read_status === 'read' &&
          `bg-custom-500 ${
            tinycolor(derivedThemeColor).isDark()
              ? 'text-bg-100'
              : 'text-bg-800'
          }`,
        item.read_status === 'reading' &&
          'text-custom-500 border-custom-500 border-[1.5px]'
      )}
      data-tooltip-id={`read-label-${item.id}`}
    >
      <Icon
        className="size-4"
        icon={
          {
            reading: 'tabler:bolt',
            read: 'tabler:check'
          }[item.read_status]
        }
      />
      {t(`sidebar.${item.read_status}`)}:{' '}
      {
        {
          read: dayjs(item.time_finished)
            .locale(language)
            .from(dayjs(item.time_started), true),
          reading: dayjs(item.time_started).locale(language).fromNow()
        }[item.read_status]
      }
    </span>
  )
}

export default ReadStatusChip
