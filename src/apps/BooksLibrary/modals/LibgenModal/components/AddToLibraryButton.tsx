import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'

function AddToLibraryButton({
  md5,
  fullWidth = false
}: {
  md5: string
  fullWidth?: boolean
}) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.booksLibrary')
  const {
    entriesQuery,
    miscellaneous: { processes }
  } = useBooksLibraryContext()

  const icon = useMemo(() => {
    if (Object.keys(processes).includes(md5)) {
      return 'svg-spinners:180-ring'
    }

    if (entriesQuery.data?.some(entry => entry.md5 === md5)) {
      return 'tabler:check'
    }

    return 'tabler:plus'
  }, [entriesQuery.data, md5, processes])

  const text = useMemo(() => {
    if (Object.keys(processes).includes(md5)) {
      return `${t('buttons.downloading')} (${processes[md5].percentage})`
    }

    if (entriesQuery.data?.some(entry => entry.md5 === md5)) {
      return t('buttons.alreadyInLibrary')
    }

    return t('buttons.addToLibrary')
  }, [entriesQuery.data, md5, processes])

  const handleAddToLibrary = useCallback(() => {
    open('booksLibrary.addToLibrary', { md5 })
  }, [md5])

  return (
    <Button
      className={fullWidth ? 'w-full xl:w-1/2' : ''}
      disabled={
        Object.keys(processes).includes(md5) ||
        entriesQuery.data?.some(entry => entry.md5 === md5)
      }
      icon={icon}
      namespace="apps.booksLibrary"
      variant={
        Object.keys(processes).includes(md5) ||
        entriesQuery.data?.some(entry => entry.md5 === md5)
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
