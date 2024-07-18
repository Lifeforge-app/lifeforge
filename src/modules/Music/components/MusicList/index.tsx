import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { useMusicContext } from '@providers/MusicProvider'
import MusicListItem from './components/MusicListItem'
import 'react-virtualized/styles.css'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

function MusicList({
  debouncedSearchQuery
}: {
  debouncedSearchQuery: string
}): React.ReactElement {
  const { musics } = useMusicContext()

  return (
    <APIComponentWithFallback data={musics}>
      {musics => (
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={
                musics.filter(music =>
                  music.name
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase())
                ).length
              }
              rowHeight={60}
              rowRenderer={({ index, key, style }) => {
                const music = musics.filter(music =>
                  music.name
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase())
                )[index]

                return (
                  <div key={key} style={style}>
                    <MusicListItem music={music} />
                  </div>
                )
              }}
            />
          )}
        </AutoSizer>
      )}
    </APIComponentWithFallback>
  )
}

export default MusicList
