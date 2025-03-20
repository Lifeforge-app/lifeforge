import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'

import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'

function AddToLibraryButton({
  md5,
  setAddToLibraryFor
}: {
  md5: string
  setAddToLibraryFor: (id: string) => void
}) {
  const { t } = useTranslation('apps.booksLibrary')
  const {
    entries: { dataQuery: entriesQuery },
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

  return (
    <Button
      className="w-full xl:w-1/2"
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
      onClick={() => {
        setAddToLibraryFor(md5)
      }}
    >
      {text}
    </Button>
  )
}

export default AddToLibraryButton
