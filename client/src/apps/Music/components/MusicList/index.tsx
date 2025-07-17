import { QueryWrapper } from 'lifeforge-ui'
import { useCallback } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import MusicListItem from './components/MusicListItem'

const AS = AutoSizer as any
const L = List as any

function MusicList({ debouncedSearchQuery }: { debouncedSearchQuery: string }) {
  const { musicsQuery } = useMusicContext()
  const musics = musicsQuery.data ?? []

  const rowRenderer = useCallback(
    ({
      index,
      key,
      style
    }: {
      index: number
      key: string
      style: React.CSSProperties
    }) => {
      const music = musics.filter(music =>
        music.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )[index]

      return (
        <div key={key} style={style}>
          <MusicListItem music={music} />
        </div>
      )
    },
    [debouncedSearchQuery, musics]
  )

  return (
    <QueryWrapper query={musicsQuery}>
      {musics => (
        <AS>
          {({ height, width }: { height: number; width: number }) => (
            <L
              height={height}
              rowCount={
                musics.filter(music =>
                  music.name
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase())
                ).length
              }
              rowHeight={60}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AS>
      )}
    </QueryWrapper>
  )
}

export default MusicList
