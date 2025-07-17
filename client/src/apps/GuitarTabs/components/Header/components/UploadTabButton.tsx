import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Button, MenuItem } from 'lifeforge-ui'
import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

function UploadTabButton({
  uploadFiles,
  setGuitarWorldModalOpen
}: {
  uploadFiles: () => void
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation('apps.guitarTabs')
  const handleOpenGuitarWorldModal = useCallback(() => {
    setGuitarWorldModalOpen(true)
  }, [])
  const tProps = useMemo(
    () => ({
      item: t('items.score')
    }),
    [t]
  )

  return (
    <Menu as="div" className="relative z-50 hidden md:block">
      <Button
        as={MenuButton}
        className="hidden md:flex"
        icon="tabler:plus"
        tProps={tProps}
      >
        new
      </Button>
      <MenuItems
        transition
        anchor="bottom end"
        className="bg-bg-100 dark:bg-bg-800 mt-2 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem
          icon="tabler:upload"
          namespace="apps.guitarTabs"
          text="Upload from local"
          onClick={uploadFiles}
        />
        <MenuItem
          icon="mingcute:guitar-line"
          namespace="apps.guitarTabs"
          text="Download from Guitar World"
          onClick={handleOpenGuitarWorldModal}
        />
      </MenuItems>
    </Menu>
  )
}

export default memo(UploadTabButton)
