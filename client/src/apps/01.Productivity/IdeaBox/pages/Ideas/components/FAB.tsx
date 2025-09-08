import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { useIdeaBoxContext } from '@apps/01.Productivity/ideaBox/providers/IdeaBoxProvider'

import ModifyFolderModal from './modals/ModifyFolderModal'
import ModifyIdeaModal from './modals/ModifyIdeaModal'

function FAB() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.ideaBox')

  const { viewArchived } = useIdeaBoxContext()

  const handleEntryCreation = useCallback(
    (name: string) => () => {
      if (name === 'Folder') {
        open(ModifyFolderModal, {
          type: 'create'
        })
      } else {
        open(ModifyIdeaModal, {
          type: 'create',
          initialData: {
            type: name.toLowerCase() as 'text' | 'link' | 'image'
          }
        })
      }
    },
    []
  )

  return !viewArchived ? (
    createPortal(
      <Menu
        as="div"
        className="group fixed right-6 bottom-6 z-9990 sm:right-12 sm:bottom-12"
      >
        {({ open }) => (
          <>
            <Button
              as={MenuButton}
              className={clsx(
                'relative z-[9991] shadow-lg',
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
                      'group flex w-full items-center justify-end gap-3 rounded-md py-2 pr-2 whitespace-nowrap'
                    }
                  >
                    <span className="text-bg-50 group-data-focus:text-bg-200 transition-all">
                      {t(`entryType.${name.toLowerCase()}`)}
                    </span>
                    <button
                      className="bg-bg-100 text-bg-800 group-data-focus:bg-bg-200 rounded-full p-3 transition-all"
                      onClick={handleEntryCreation(name)}
                    >
                      <Icon className="size-5" icon={icon} />
                    </button>
                  </div>
                </MenuItem>
              ))}
            </MenuItems>
            <div
              className={clsx(
                'fixed top-0 left-0 z-[9990] size-full transition-transform',
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
      </Menu>,
      (document.getElementById('app') as HTMLElement) || document.body
    )
  ) : (
    <></>
  )
}

export default FAB
