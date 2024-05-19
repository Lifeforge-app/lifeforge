/* eslint-disable @typescript-eslint/no-misused-promises */
import { useDebounce } from '@uidotdev/usehooks'
import React from 'react'
import SearchInput from '../../components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal'
import ModuleHeader from '../../components/Module/ModuleHeader'
import ModuleWrapper from '../../components/Module/ModuleWrapper'
import APIComponentWithFallback from '../../components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '../../components/Screens/EmptyStateScreen'
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
    isDeleteMusicConfirmationModalOpen,
    setIsDeleteMusicConfirmationModalOpen
  } = useMusicContext()
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Music"
        desc="..."
        actionButton={<AddMusicButton />}
      />
      <div className="relative flex h-full min-h-0 min-w-0 flex-col">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="musics"
        />
        <div className="relative h-full min-w-0 overflow-y-auto">
          <APIComponentWithFallback data={musics}>
            {typeof musics !== 'string' &&
            musics.filter(music =>
              music.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase())
            ).length > 0 ? (
              <MusicList debouncedSearchQuery={debouncedSearchQuery} />
            ) : (
              <EmptyStateScreen
                title={
                  musics.length > 0
                    ? 'Oops! Nothing found here.'
                    : '"Oops! Nothing to see here."'
                }
                icon={
                  musics.length > 0 ? 'tabler:search-off' : 'tabler:music-off'
                }
                description={
                  musics.length > 0
                    ? "The search query that you entered doesn't seem to yield any result."
                    : 'Add the music by either downloading it or putting it into your NAS folder'
                }
                customCTAButton={
                  musics.length > 0 ? <AddMusicButton /> : undefined
                }
              />
            )}
          </APIComponentWithFallback>
        </div>
        {currentMusic !== null && <BottomBar />}
      </div>
      <YoutubeDownloaderModal />
      <DeleteConfirmationModal
        apiEndpoint="music/entry/delete"
        data={existedData}
        isOpen={isDeleteMusicConfirmationModalOpen}
        itemName="music"
        onClose={() => {
          setIsDeleteMusicConfirmationModalOpen(false)
        }}
        updateDataList={refreshMusics}
        nameKey="name"
      />
      <ModifyMusicModal />
    </ModuleWrapper>
  )
}

export default Music
