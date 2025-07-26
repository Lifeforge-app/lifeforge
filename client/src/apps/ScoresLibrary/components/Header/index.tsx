import { FAB, ModuleHeader } from 'lifeforge-ui'
import { useMemo } from 'react'

import type { ScoreLibrarySortType } from '@apps/ScoresLibrary'

import ActionMenu from './components/ActionMenu'
import UploadTabButton from './components/UploadTabButton'

function Header({
  totalItems,
  setGuitarWorldModalOpen,
  view,
  setView,
  sortType,
  setSortType,
  uploadFiles
}: {
  totalItems: number | undefined
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  view: 'grid' | 'list'
  setView: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
  sortType: ScoreLibrarySortType
  setSortType: React.Dispatch<React.SetStateAction<ScoreLibrarySortType>>
  uploadFiles: () => void
}) {
  const memoizedActionButton = useMemo(
    () => (
      <UploadTabButton
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
        uploadFiles={uploadFiles}
      />
    ),
    []
  )

  const memoizedActionMenu = useMemo(
    () => (
      <ActionMenu
        setSortType={setSortType}
        setView={setView}
        sortType={sortType}
        view={view}
      />
    ),
    [sortType, view]
  )

  return (
    <>
      <ModuleHeader
        actionButton={memoizedActionButton}
        hamburgerMenuItems={memoizedActionMenu}
        icon="tabler:file-music"
        tips="If you want to append audio and Musescore files to your music scores, make sure to name them the same as the PDF file and upload them together."
        title="Scores Library"
        totalItems={totalItems}
      />
      <FAB icon="tabler:plus" onClick={uploadFiles} />
    </>
  )
}

export default Header
