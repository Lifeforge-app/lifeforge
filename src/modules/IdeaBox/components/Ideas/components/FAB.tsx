import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
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
    React.SetStateAction<'create' | 'update' | null>
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
        className="group fixed bottom-6 right-6 z-[9998] overscroll-contain sm:bottom-12 sm:right-12 "
      >
        {({ open }) => (
          <>
            <Menu.Button className="relative z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800">
              <Icon
                icon="tabler:plus"
                className={`size-6 shrink-0 transition-all ${
                  open ? 'rotate-45' : ''
                }`}
              />
            </Menu.Button>
            <Transition
              enter="transition-all ease-out duration-300 overflow-hidden"
              enterFrom="max-h-0"
              enterTo="max-h-96"
              leave="transition-all ease-in duration-200 overflow-hidden"
              leaveFrom="max-h-96"
              leaveTo="max-h-0"
              className="absolute bottom-0 right-0 z-10 -translate-y-16 overflow-hidden"
            >
              <Menu.Items className="mt-2 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="py-1">
                  {[
                    ...(folderId === undefined
                      ? [['Folder', 'tabler:folder']]
                      : []),
                    ['Text', 'tabler:text-size'],
                    ['Link', 'tabler:link'],
                    ['Image', 'tabler:photo']
                  ].map(([name, icon]) => (
                    <Menu.Item key={name}>
                      {({ active }) => (
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
                          className={`group flex w-full items-center justify-end gap-4 whitespace-nowrap rounded-md py-3 pr-2 ${
                            active ? 'text-bg-200' : 'text-bg-100'
                          }`}
                        >
                          {t(`ideaBox.entryType.${name.toLowerCase()}`)}
                          <button
                            className={`rounded-full ${
                              active ? 'bg-bg-300' : 'bg-bg-200'
                            } p-3`}
                          >
                            <Icon
                              icon={icon}
                              className={`size-5 text-bg-800 ${
                                active ? 'text-bg-300' : ''
                              }`}
                            />
                          </button>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
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
