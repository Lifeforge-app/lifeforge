import { DIFFICULTIES } from '@'
import useFilter from '@/hooks/useFilter'
import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import { SidebarItem, SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

function DifficultiesSection() {
  const { t } = useTranslation('apps.achievements')

  const { bgTempPalette } = usePersonalization()

  const { updateFilter, filter } = useFilter()

  const difficultiesCountQuery = useQuery(
    forgeAPI.achievements.entries.difficultiesCount.queryOptions()
  )

  return (
    <>
      <SidebarTitle label={t('sidebar.difficulties')} />
      <SidebarItem
        active={!filter.difficulty}
        icon="tabler:circle-dot-filled"
        label={t('sidebar.allDifficulties')}
        sideStripColor={bgTempPalette[500]}
        onClick={() => {
          updateFilter('difficulty', null)
        }}
      />
      <WithQuery query={difficultiesCountQuery}>
        {difficultiesCount => (
          <>
            {Object.entries(DIFFICULTIES).map(([difficulty, color]) => (
              <SidebarItem
                key={difficulty}
                active={filter.difficulty === difficulty}
                icon="tabler:circle-dot"
                label={t(`difficulties.${difficulty}`)}
                number={difficultiesCount[difficulty] || 0}
                sideStripColor={color}
                onCancelButtonClick={() => {
                  updateFilter('difficulty', null)
                }}
                onClick={() => {
                  updateFilter('difficulty', difficulty)
                }}
              />
            ))}
          </>
        )}
      </WithQuery>
    </>
  )
}

export default DifficultiesSection
