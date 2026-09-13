import type { BooksLibraryEntry } from '@'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useModuleTranslation } from '@lifeforge/localization'
import { TagChip, usePersonalization } from '@lifeforge/ui'

dayjs.extend(relativeTime)

function ReadStatusChip({ item }: { item: BooksLibraryEntry }) {
  const { t } = useModuleTranslation()
  const { derivedThemeColor, language } = usePersonalization()

  if (item.read_status === 'unread') {
    return null
  }

  const isRead = item.read_status === 'read'

  return (
    <TagChip
      color={derivedThemeColor}
      icon={isRead ? 'tabler:check' : 'tabler:bolt'}
      label={`${t(`sidebar.${item.read_status}`)}: ${
        isRead
          ? dayjs(item.time_finished)
              .locale(language)
              .from(dayjs(item.time_started), true)
          : dayjs(item.time_started).locale(language).fromNow()
      }`}
      mb="lg"
      mt="md"
      size="sm"
      variant={isRead ? 'filled' : 'outlined'}
      width="min-content"
    />
  )
}

export default ReadStatusChip
