import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'

function FAB(): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')
  const {
    setTypeOfModifyIdea,
    setModifyIdeaModalOpenType,
    setExistedFolder,
    setModifyFolderModalOpenType,
    setExistedEntry,
    viewArchived
  } = useIdeaBoxContext()

  return !viewArchived ? (
    <>
      <Menu
        as="div"
        className="group fixed right-6 bottom-6 z-9990 sm:right-12 sm:bottom-12"
      >
        {({ open }) => (
          <>
            <Button
              as={MenuButton}
              className={clsx(
                'relative z-10 shadow-lg',
                open && 'rotate-45',
                'transition-all'
              )}
              icon="tabler:plus"
              iconClassName={clsx(open && 'rotate-45', 'transition-all')}
            />
            <MenuItems
              transition
              anchor="top end"
              className={clsx(
                'z-9999 mb-4 rounded-lg outline-hidden transition duration-100 ease-out [--anchor-gap:1rem] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0'
              )}
            >
              {[
                ['Folder', 'tabler:folder'],
                ['Text', 'tabler:text-size'],
                ['Link', 'tabler:link'],
                ['Image', 'tabler:photo']
              ].map(([name, icon]) => (
                <MenuItem key={name}>
                  <div
                    className={
                      'group flex w-full items-center justify-end gap-4 rounded-md py-2 pr-2 whitespace-nowrap'
                    }
                  >
                    <span className="text-bg-50 group-data-focus:text-bg-200 transition-all">
                      {t(`entryType.${name.toLowerCase()}`)}
                    </span>
                    <button
                      className="bg-bg-100 text-bg-800 group-data-focus:bg-bg-200 rounded-full p-3 transition-all"
                      onClick={() => {
                        if (name === 'Folder') {
                          setExistedFolder(null)
                          setModifyFolderModalOpenType('create')
                        } else {
                          setExistedEntry(null)
                          setTypeOfModifyIdea(
                            name.toLowerCase() as 'link' | 'image' | 'text'
                          )
                          setModifyIdeaModalOpenType('create')
                        }
                      }}
                    >
                      <Icon className="size-5" icon={icon} />
                    </button>
                  </div>
                </MenuItem>
              ))}
            </MenuItems>
            <div
              className={clsx(
                'fixed top-0 left-0 size-full transition-transform',
                open ? 'translate-x-0 duration-0' : 'translate-x-full delay-100'
              )}
            >
              <div
                className={clsx(
                  'bg-bg-900/50 size-full backdrop-blur-xs transition-opacity',
                  open ? 'opacity-100' : 'opacity-0'
                )}
              />
            </div>
          </>
        )}
      </Menu>
    </>
  ) : (
    <></>
  )
}

export default FAB
