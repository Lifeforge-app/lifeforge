import { ErrorScreen, LoadingScreen, Pagination } from 'lifeforge-ui'

import { IGuitarTabsGuitarWorldScores } from '@apps/GuitarTabs/interfaces/guitar_tabs_interfaces'

import ScoreItem from './ScoreItem'

function ScoreList({
  data,
  page,
  setPage,
  cookie
}: {
  data: IGuitarTabsGuitarWorldScores | 'loading' | 'error'
  page: number
  setPage: (page: number) => void
  cookie: string
}) {
  if (data === 'loading') {
    return <LoadingScreen />
  }

  if (data === 'error') {
    return <ErrorScreen message="Failed to fetch data" />
  }

  return (
    <>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(data.totalItems / data.perPage)}
        onPageChange={setPage}
      />
      <ul className="divide-bg-200 dark:divide-bg-800/50 my-4 divide-y">
        {data.data.map(entry => (
          <ScoreItem key={entry.id} cookie={cookie} entry={entry} />
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(data.totalItems / data.perPage)}
        onPageChange={setPage}
      />
    </>
  )
}

export default ScoreList
