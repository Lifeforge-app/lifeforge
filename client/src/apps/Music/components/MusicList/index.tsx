import { WithQuery } from 'lifeforge-ui'

import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import MusicListItem from './components/MusicListItem'

function MusicList({ debouncedSearchQuery }: { debouncedSearchQuery: string }) {
  const { musicsQuery } = useMusicContext()

  return (
    <WithQuery query={musicsQuery}>
      {musics => (
        <div className="space-y-3 pb-12">
          {musics
            .filter(music =>
              music.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            )
            .map(music => (
              <MusicListItem key={music.id} music={music} />
            ))}
        </div>
      )}
    </WithQuery>
  )
}

export default MusicList
