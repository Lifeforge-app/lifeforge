import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import IconSet from './pages/IconSet'
import IconSetList from './pages/IconSetList/index'
import Search from './pages/Search'

function IconPickerModal({
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

  function renderContent() {
    if (currentIconSet === null) {
      return <IconSetList setCurrentIconSet={setCurrentIconSet} />
    }

    if (currentIconSet.search !== undefined) {
      return (
        <Search
          searchTerm={currentIconSet.search}
          setCurrentIconSetProp={setCurrentIconSet}
          setSelectedIcon={setSelectedIcon}
          setOpen={setOpen}
        />
      )
    }

    return (
      <IconSet
        iconSet={currentIconSet.iconSet ?? ''}
        setSelectedIcon={setSelectedIcon}
        setOpen={setOpen}
      />
    )
  }

  return (
    <ModalWrapper isOpen={isOpen} minWidth="80vw" minHeight="80vh">
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
      {renderContent()}
    </ModalWrapper>
  )
}

export default IconPickerModal
