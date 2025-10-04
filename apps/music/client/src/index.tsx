import { useMusicContext } from '@/providers/MusicProvider'
import { useDebounce } from '@uidotdev/usehooks'
import {
  EmptyStateScreen,
  ModuleHeader,
  Scrollbar,
  SearchInput,
  WithQuery
} from 'lifeforge-ui'
import { useEffect } from 'react'

import AddMusicButton from './components/AddMusicButton'
import BottomBar from './components/Bottombar'
import MusicList from './components/MusicList'

function Music() {
  const { searchQuery, setSearchQuery, musicsQuery, currentMusic, togglePlay } =
    useMusicContext()

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault()

        if (currentMusic !== null) {
          togglePlay(currentMusic).catch(console.error)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  })

  return (
    <>
      <ModuleHeader
        actionButton={<AddMusicButton />}
        totalItems={musicsQuery.data?.length}
      />
      <div className="music relative flex size-full min-h-0 min-w-0 flex-col sm:mt-0">
        <SearchInput
          namespace="apps.music"
          searchTarget="music"
          setValue={setSearchQuery}
          value={searchQuery}
        />
        <div className="relative mt-4 flex size-full min-w-0">
          <Scrollbar>
            <WithQuery query={musicsQuery}>
              {musics =>
                musics.filter(music =>
                  music.name
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase())
                ).length > 0 ? (
                  <MusicList debouncedSearchQuery={debouncedSearchQuery} />
                ) : (
                  <EmptyStateScreen
                    icon={
                      musics.length > 0
                        ? 'tabler:search-off'
                        : 'tabler:music-off'
                    }
                    name={musics.length > 0 ? 'result' : 'music'}
                    namespace="apps.music"
                  />
                )
              }
            </WithQuery>
          </Scrollbar>
        </div>
        <BottomBar />
      </div>
    </>
  )
}

export default Music
