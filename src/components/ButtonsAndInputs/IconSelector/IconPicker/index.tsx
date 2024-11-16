import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import IconSetList from './pages/IconSetList/index'
import IconSet from '../IconPicker/pages/IconSet'
import Search from '../IconPicker/pages/Search'

function IconPicker({
  isOpen,
  setOpen,
  setSelectedIcon
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedIcon: (icon: string) => void
}): React.ReactElement {
  const [currentIconSet, setCurrentIconSet] = useState<{
    iconSet?: string
    search?: string
  } | null>(null)

  return (
    <ModalWrapper
      affectHeader={false}
      isOpen={isOpen}
      minWidth="80vw"
      minHeight="80vh"
    >
      {currentIconSet !== null ? (
        <div className="flex-between mb-8 flex w-full">
          <button
            onClick={() => {
              setCurrentIconSet(null)
            }}
            type="button"
            className="flex items-center gap-2 text-lg"
          >
            <Icon icon="uil:arrow-left" className="size-7" />
            Go Back
          </button>
          <button
            onClick={() => {
              setCurrentIconSet(null)
              setSelectedIcon('')
              setOpen(false)
            }}
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50"
          >
            <Icon icon="tabler:x" className="size-6" />
          </button>
        </div>
      ) : (
        <ModalHeader
          title="Select an Icon"
          icon="tabler:icons"
          onClose={() => {
            setOpen(false)
          }}
          appendTitle={
            <p className="shrink-0 text-right text-sm sm:text-base">
              powered by&nbsp;
              <a
                target="_blank"
                href="https://iconify.thecodeblog.net"
                className="underline"
                rel="noreferrer"
              >
                Iconify
              </a>
            </p>
          }
        />
      )}
      {currentIconSet !== null ? (
        currentIconSet.search !== undefined ? (
          <Search
            searchTerm={currentIconSet.search}
            setCurrentIconSetProp={setCurrentIconSet}
            setSelectedIcon={setSelectedIcon}
            setOpen={setOpen}
          />
        ) : (
          <IconSet
            iconSet={currentIconSet.iconSet ?? ''}
            setSelectedIcon={setSelectedIcon}
            setOpen={setOpen}
          />
        )
      ) : (
        <IconSetList setCurrentIconSet={setCurrentIconSet} />
      )}
    </ModalWrapper>
  )
}

export default IconPicker
