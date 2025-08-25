import { FAB, ModuleHeader } from 'lifeforge-ui'

import ActionMenu from './components/ActionMenu'
import UploadTabButton from './components/UploadTabButton'

function Header({
  totalItems,
  setGuitarWorldModalOpen,
  uploadFiles
}: {
  totalItems: number | undefined
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  uploadFiles: () => void
}) {
  return (
    <>
      <ModuleHeader
        actionButton={
          <UploadTabButton
            setGuitarWorldModalOpen={setGuitarWorldModalOpen}
            uploadFiles={uploadFiles}
          />
        }
        contextMenuProps={{
          classNames: {
            wrapper: 'flex md:hidden'
          },
          children: <ActionMenu />
        }}
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
