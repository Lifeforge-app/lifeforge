import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { useMusicContext } from '@providers/MusicProvider'
import MusicListItem from './components/MusicListItem'

function MusicList({
  debouncedSearchQuery
}: {
  debouncedSearchQuery: string
}): React.ReactElement {
  const { musics } = useMusicContext()

  return (
    <APIComponentWithFallback data={musics}>
      {musics => (
        <>
          {musics
            .filter(music =>
              music.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            )
            .map(music => (
              <MusicListItem key={music.id} music={music} />
            ))}
        </>
      )}
    </APIComponentWithFallback>
  )
}

export default MusicList
