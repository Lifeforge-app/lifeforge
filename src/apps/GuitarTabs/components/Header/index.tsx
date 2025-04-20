import { useMemo } from 'react'

import { FAB, ModuleHeader } from '@lifeforge/ui'

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
  sortType: string
  setSortType: React.Dispatch<React.SetStateAction<string>>
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
        icon="mingcute:guitar-line"
        tips="If you want to append audio and Musescore files to your guitar tabs, make sure to name them the same as the PDF file and upload them together."
        title="Guitar Tabs"
        totalItems={totalItems}
      />
      <FAB icon="tabler:plus" onClick={uploadFiles} />
    </>
  )
}

export default Header
