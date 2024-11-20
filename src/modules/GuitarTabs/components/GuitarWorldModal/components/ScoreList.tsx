import React from 'react'
import Pagination from '@components/Miscellaneous/Pagination'
import { type IGuitarTabsGuitarWorldScores } from '@interfaces/guitar_tabs_interfaces'
import ScoreItem from './ScoreItem'

function ScoreList({
  data,
  page,
  setPage,
  cookie
}: {
  data: IGuitarTabsGuitarWorldScores
  page: number
  setPage: (page: number) => void
  cookie: string
}): React.ReactElement {
  return (
    <>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalPages={Math.ceil(data.totalItems / data.perPage)}
      />
      <ul className="my-4 divide-y divide-bg-200 dark:divide-bg-800/50">
        {data.data.map(entry => (
          <ScoreItem key={entry.id} entry={entry} cookie={cookie} />
        ))}
      </ul>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalPages={Math.ceil(data.totalItems / data.perPage)}
      />
    </>
  )
}

export default ScoreList
