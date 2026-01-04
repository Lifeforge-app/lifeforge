import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

dayjs.extend(relativeTime)

function AchievementMeta({
  title,
  thoughts,
  category,
  created
}: {
  category: string
  title: string
  thoughts: string
  created: string
}) {
  const { t } = useTranslation('apps.achievements')

  const { language } = usePersonalization()

  const categoriesQuery = useQuery(
    forgeAPI.achievements.categories.list.queryOptions()
  )

  const categories = categoriesQuery.data || []

  const categoryData = useCallback(
    () => categories.find(cat => cat.id === category),
    [categories, category]
  )()

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center gap-2 sm:mr-12">
        {categoryData && (
          <>
            <p className="text-bg-600 dark:text-bg-400 flex items-center gap-1 text-sm font-medium">
              <div
                className="rounded-sm p-1"
                style={{ backgroundColor: categoryData.color + '20' }}
              >
                <Icon
                  className="h-4 w-4"
                  icon={categoryData.icon}
                  style={{ color: categoryData.color }}
                />
              </div>
              {categoryData.name}
            </p>
            <Icon className="text-bg-500 size-1" icon="tabler:circle-filled" />
          </>
        )}
        <p className="text-bg-400 text-sm">
          {t('accomplishedOn', {
            date: dayjs(created).locale(language).fromNow()
          })}
        </p>
      </div>
      <h2 className="text-lg font-semibold sm:mr-12">{title}</h2>
      <p className="text-bg-500 mt-1 text-sm whitespace-pre-wrap">{thoughts}</p>
    </div>
  )
}

export default AchievementMeta
