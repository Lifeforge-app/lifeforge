import { GoBackButton } from '@components/buttons'
import { ModalHeader } from '@components/modals'
import { Icon } from '@iconify/react'
import { useCallback, useState } from 'react'

import IconSet from './pages/IconSet'
import IconSetList from './pages/IconSetList/index'
import Search from './pages/Search'

function IconPickerModal({
  data: { setSelectedIcon },
  onClose
}: {
  data: {
    setSelectedIcon: (icon: string) => void
  }
  onClose: () => void
}) {
  const [currentIconSet, setCurrentIconSet] = useState<{
    iconSet?: string
    search?: string
  } | null>(null)

  const handleIconSelected = useCallback((icon: string) => {
    setSelectedIcon(icon)
    onClose()
  }, [])

  function renderContent() {
    if (currentIconSet === null) {
      return <IconSetList setCurrentIconSet={setCurrentIconSet} />
    }

    if (currentIconSet.search !== undefined) {
      return (
        <Search
          searchTerm={currentIconSet.search}
          setCurrentIconSetProp={setCurrentIconSet}
          onIconSelected={handleIconSelected}
        />
      )
    }

    return (
      <IconSet
        iconSet={currentIconSet.iconSet ?? ''}
        onIconSelected={handleIconSelected}
      />
    )
  }

  return (
    <div className="flex min-h-[80vh] min-w-[80vw] flex-col">
      {currentIconSet !== null ? (
        <div className="flex-between mb-8 flex w-full">
          <GoBackButton onClick={() => setCurrentIconSet(null)} />
          <button
            className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50 rounded-md p-2 transition-all"
            onClick={() => {
              setCurrentIconSet(null)
              setSelectedIcon('')
              onClose()
            }}
          >
            <Icon className="size-6" icon="tabler:x" />
          </button>
        </div>
      ) : (
        <ModalHeader
          appendTitle={
            <p className="shrink-0 text-right text-sm sm:text-base">
              powered by&nbsp;
              <a
                className="underline"
                href="https://iconify.design"
                rel="noreferrer"
                target="_blank"
              >
                Iconify
              </a>
            </p>
          }
          icon="tabler:icons"
          title="iconPicker.title"
          onClose={onClose}
        />
      )}
      {renderContent()}
    </div>
  )
}

export default IconPickerModal
