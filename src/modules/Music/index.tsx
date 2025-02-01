import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect } from 'react'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import { useMusicContext } from '@providers/MusicProvider'
import AddMusicButton from './components/AddMusicButton'
import BottomBar from './components/Bottombar'
import MusicList from './components/MusicList'
import ModifyMusicModal from './modals/UpdateMusicModal'
import YoutubeDownloaderModal from './modals/YoutubeDownloaderModal'

function Music(): React.ReactElement {
  const {
    searchQuery,
    setSearchQuery,
    musics,
    refreshMusics,
    currentMusic,
    existedData,
    togglePlay,
    isDeleteMusicConfirmationModalOpen,
    setIsDeleteMusicConfirmationModalOpen
  } = useMusicContext()
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
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
    <ModuleWrapper>
      <ModuleHeader
        title="Music"
        actionButton={<AddMusicButton />}
        totalItems={musics.length}
        icon="tabler:music"
      />
      <div className="music relative mt-4 flex size-full min-h-0 min-w-0 flex-col sm:mt-0">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="music"
          namespace="modules.music"
        />
        <div className="relative flex size-full min-w-0 flex-col divide-y-2 divide-bg-200/50 dark:divide-bg-900">
          <Scrollbar>
            <APIFallbackComponent data={musics}>
              {musics =>
                musics.filter(music =>
                  music.name
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase())
                ).length > 0 ? (
                  <MusicList debouncedSearchQuery={debouncedSearchQuery} />
                ) : (
                  <EmptyStateScreen
                    namespace="modules.music"
                    name={musics.length > 0 ? 'result' : 'music'}
                    icon={
                      musics.length > 0
                        ? 'tabler:search-off'
                        : 'tabler:music-off'
                    }
                    customCTAButton={
                      musics.length > 0 ? <AddMusicButton /> : undefined
                    }
                  />
                )
              }
            </APIFallbackComponent>
          </Scrollbar>
        </div>
        {currentMusic !== null && <BottomBar />}
      </div>
      <YoutubeDownloaderModal />
      <DeleteConfirmationModal
        apiEndpoint="music/entries"
        data={existedData}
        isOpen={isDeleteMusicConfirmationModalOpen}
        itemName="music"
        onClose={() => {
          setIsDeleteMusicConfirmationModalOpen(false)
        }}
        updateDataLists={refreshMusics}
        nameKey="name"
      />
      <ModifyMusicModal />
    </ModuleWrapper>
  )
}

export default Music
