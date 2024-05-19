import React from 'react'
import { useMusicContext } from '@providers/MusicProvider'
import MusicListItem from './components/MusicListItem'
import APIComponentWithFallback from '../../../../components/Screens/APIComponentWithFallback'

function MusicList({
  debouncedSearchQuery
}: {
  debouncedSearchQuery: string
}): React.ReactElement {
  const { musics } = useMusicContext()

  return (
    <APIComponentWithFallback data={musics}>
      {typeof musics !== 'string' && (
        <table className="mb-36 mt-6 w-full min-w-0 table-auto">
          <tbody className="divide-y divide-bg-200 dark:divide-bg-800">
            {musics
              .filter(music =>
                music.name
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())
              )
              .map(music => (
                <MusicListItem key={music.id} music={music} />
              ))}
          </tbody>
        </table>
      )}
    </APIComponentWithFallback>
  )
}

export default MusicList
