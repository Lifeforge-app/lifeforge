import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import {
  type IIdeaBoxEntry,
  type IIdeaBoxFolder
} from '@interfaces/ideabox_interfaces'

function FAB({
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setModifyFolderModalOpenType,
  setExistedData,
  setExistedFolderData
}: {
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  setModifyFolderModalOpenType?: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IIdeaBoxEntry | null>>
  setExistedFolderData?: React.Dispatch<
    React.SetStateAction<IIdeaBoxFolder | null>
  >
}): React.ReactElement {
  const { t } = useTranslation()
  const { folderId } = useParams()

  return (
    <>
      <Menu
        as="div"
        className="group fixed bottom-6 right-6 z-[9990] sm:bottom-12 sm:right-12"
      >
        {({ open }) => (
          <>
            <Button
              as={MenuButton}
              className="relative z-10 shadow-lg"
              icon="tabler:plus"
              iconClassName={`${open ? 'rotate-45' : ''} transition-all`}
            />
            <MenuItems
              transition
              anchor="top end"
              className="z-[9999] mb-4 rounded-lg outline-none transition duration-100
              ease-out [--anchor-gap:1rem] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0
              "
            >
              {[
                ...(folderId === undefined
                  ? [['Folder', 'tabler:folder']]
                  : []),
                ['Text', 'tabler:text-size'],
                ['Link', 'tabler:link'],
                ['Image', 'tabler:photo']
              ].map(([name, icon]) => (
                <MenuItem key={name}>
                  <button
                    onClick={() => {
                      if (
                        name === 'Folder' &&
                        setExistedFolderData !== undefined &&
                        setModifyFolderModalOpenType !== undefined
                      ) {
                        setExistedFolderData(null)
                        setModifyFolderModalOpenType('create')
                      } else {
                        setExistedData(null)
                        setTypeOfModifyIdea(
                          name.toLowerCase() as 'link' | 'image' | 'text'
                        )
                        setModifyIdeaModalOpenType('create')
                      }
                    }}
                    className={
                      'group flex w-full items-center justify-end gap-4 whitespace-nowrap rounded-md py-2 pr-2'
                    }
                  >
                    <span className="text-bg-50 transition-all group-data-[focus]:text-bg-200">
                      {t(`ideaBox.entryType.${name.toLowerCase()}`)}
                    </span>
                    <button className="rounded-full bg-bg-200 p-3 transition-all group-data-[focus]:bg-bg-300">
                      <Icon icon={icon} className="size-5" />
                    </button>
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
            <div
              className={`fixed left-0 top-0 size-full transition-transform ${
                open ? 'translate-x-0 duration-0' : 'translate-x-full delay-100'
              }`}
            >
              <div
                className={`size-full bg-bg-900/50 backdrop-blur-sm transition-opacity ${
                  open ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </>
        )}
      </Menu>
    </>
  )
}

export default FAB
