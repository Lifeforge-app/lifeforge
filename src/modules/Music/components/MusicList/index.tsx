import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

import { APIFallbackComponent } from '@lifeforge/ui'

import { useMusicContext } from '@modules/Music/providers/MusicProvider'

import MusicListItem from './components/MusicListItem'

const AS = AutoSizer as any
const L = List as any

function MusicList({ debouncedSearchQuery }: { debouncedSearchQuery: string }) {
  const { musics } = useMusicContext()

  return (
    <APIFallbackComponent data={musics}>
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
              rowRenderer={({
                index,
                key,
                style
              }: {
                index: number
                key: string
                style: React.CSSProperties
              }) => {
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
              width={width}
            />
          )}
        </AS>
      )}
    </APIFallbackComponent>
  )
}

export default MusicList
