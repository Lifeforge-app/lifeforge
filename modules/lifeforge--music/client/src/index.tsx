import { useEffect } from 'react'

import {
  EmptyStateScreen,
  ModuleHeader,
  Scrollbar,
  SearchInput,
  WithQuery
} from '@lifeforge/ui'

import { useMusicContext } from '@/providers/MusicProvider'

import AddMusicButton from './components/AddMusicButton'
import BottomBar from './components/Bottombar'
import MusicList from './components/MusicList'
import './index.css'

function Music() {
  const { searchQuery, setSearchQuery, musicsQuery, currentMusic, togglePlay } =
    useMusicContext()

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
      <ModuleHeader trailing={<AddMusicButton />} />
      <div className="music relative flex size-full min-h-0 min-w-0 flex-col sm:mt-0">
        <SearchInput
          debounceMs={300}
          searchTarget="music"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="relative mt-4 flex size-full min-w-0">
          <Scrollbar>
            <WithQuery query={musicsQuery}>
              {musics =>
                musics.filter(music =>
                  music.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 ? (
                  <MusicList searchQuery={searchQuery} />
                ) : (
                  <EmptyStateScreen
                    icon={
                      musics.length > 0
                        ? 'tabler:search-off'
                        : 'tabler:music-off'
                    }
                    message={{
                      id: musics.length > 0 ? 'result' : 'music'
                    }}
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
