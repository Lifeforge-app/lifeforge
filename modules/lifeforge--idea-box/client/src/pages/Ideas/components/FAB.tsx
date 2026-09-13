import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useModuleTranslation } from '@lifeforge/localization'
import { Button, Icon, useModalStore } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

import ModifyFolderModal from './modals/ModifyFolderModal'
import ModifyIdeaModal from './modals/ModifyIdeaModal'

function FAB() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { viewArchived } = useIdeaBoxContext()
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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
      setIsOpen(false)
    },
    [open]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const menuItems = [
    ['Folder', 'tabler:folder'],
    ['Text', 'tabler:text-size'],
    ['Link', 'tabler:link'],
    ['Image', 'tabler:photo']
  ] as const

  return !viewArchived ? (
    createPortal(
      <div
        ref={menuRef}
        className="group fixed right-6 bottom-6 z-9990 sm:right-12 sm:bottom-12"
      >
        <Button
          className={clsx(
            'relative z-[9991] shadow-lg',
            isOpen && 'rotate-45',
            'transition-all'
          )}
          icon="tabler:plus"
          iconClassName={clsx(isOpen && 'rotate-45', 'transition-all')}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div
          className={clsx(
            'absolute right-0 bottom-full z-9999 mb-4 rounded-lg outline-hidden transition duration-100 ease-out focus:outline-hidden',
            isOpen
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          )}
        >
          {menuItems.map(([name, icon], index) => (
            <div
              key={name}
              className={clsx(
                'group flex w-full items-center justify-end gap-3 rounded-md py-2 pr-2 whitespace-nowrap',
                focusedIndex === index && 'bg-bg-800/50'
              )}
              onMouseEnter={() => setFocusedIndex(index)}
              onMouseLeave={() => setFocusedIndex(null)}
            >
              <span
                className={clsx(
                  'text-bg-50 transition-all',
                  focusedIndex === index && 'text-bg-200'
                )}
              >
                {t(`entryType.${name.toLowerCase()}`)}
              </span>
              <button
                className={clsx(
                  'bg-bg-100 text-bg-800 rounded-full p-3 transition-all',
                  focusedIndex === index && 'bg-bg-200'
                )}
                onClick={handleEntryCreation(name)}
              >
                <Icon className="size-5" icon={icon} />
              </button>
            </div>
          ))}
        </div>
        <div
          className={clsx(
            'fixed top-0 left-0 z-[9990] size-full transition-transform',
            isOpen ? 'translate-x-0 duration-0' : 'translate-x-full delay-100'
          )}
        >
          <div
            className={clsx(
              'bg-bg-900/50 size-full backdrop-blur-xs transition-opacity',
              isOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => {
              setIsOpen(false)
            }}
          />
        </div>
      </div>,
      (document.getElementById('app') as HTMLElement) || document.body
    )
  ) : (
    <></>
  )
}

export default FAB
