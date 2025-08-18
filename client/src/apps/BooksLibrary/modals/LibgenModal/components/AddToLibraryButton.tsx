import { Button } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'
import AddToLibraryModal from '../../AddToLibraryModal'

// TODO: Check whether the book is already in the library
function AddToLibraryButton({
  book,
  provider,
  fullWidth = false
}: {
  book: Record<string, any>
  provider: string
  fullWidth?: boolean
}) {
  const md5 = book.md5

  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.booksLibrary')

  const {
    miscellaneous: { processes }
  } = useBooksLibraryContext()

  const targetProcess = useMemo(() => {
    return Object.values(processes).find(
      process =>
        process?.data?.md5 === md5 && process?.module === 'booksLibrary'
    )
  }, [md5, processes])

  const icon = useMemo(() => {
    if (targetProcess) {
      return 'svg-spinners:180-ring'
    }

    if (false) {
      //entriesQuery.data?.some(entry => entry.md5 === md5)
      return 'tabler:check'
    }

    return 'tabler:plus'
  }, [md5, processes])

  const text = useMemo(() => {
    if (targetProcess) {
      return `${t('buttons.downloading')} (${targetProcess.progress?.percentage || 0})`
    }

    if (false) {
      //entriesQuery.data?.some(entry => entry.md5 === md5)
      return t('buttons.alreadyInLibrary')
    }

    return t('buttons.addToLibrary')
  }, [md5, processes])

  const handleAddToLibrary = useCallback(() => {
    open(AddToLibraryModal, { provider, book })
  }, [md5])

  return (
    <Button
      className={
        fullWidth ? `w-full ${provider === 'libgen.is' && 'lg:w-1/2'}` : ''
      }
      disabled={
        !!targetProcess // || entriesQuery.data?.some(entry => entry.md5 === md5)
      }
      icon={icon}
      namespace="apps.booksLibrary"
      variant={
        targetProcess //|| entriesQuery.data?.some(entry => entry.md5 === md5)
          ? 'plain'
          : 'primary'
      }
      onClick={handleAddToLibrary}
    >
      {text}
    </Button>
  )
}

export default AddToLibraryButton
