import { Button, useModuleSidebarState } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import useFilter from '../hooks/useFilter'

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useTranslation('apps.scoresLibrary')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const { starred, author, category, collection } = useFilter()

  return (
    <header className="flex-between flex w-full">
      <div className="flex min-w-0 items-end">
        <h1 className="truncate text-3xl font-semibold">
          {[
            starred && t('header.starred'),
            author || category || collection
              ? t('header.filteredScores')
              : t('header.allScores')
          ]
            .filter(Boolean)
            .join(' ')}
        </h1>
        <span className="text-bg-500 mr-8 ml-2 text-base">
          ({totalItemsCount})
        </span>
      </div>
      <Button
        className="lg:hidden"
        icon="tabler:menu"
        variant="plain"
        onClick={() => {
          setIsSidebarOpen(true)
        }}
      />
    </header>
  )
}

export default InnerHeader
