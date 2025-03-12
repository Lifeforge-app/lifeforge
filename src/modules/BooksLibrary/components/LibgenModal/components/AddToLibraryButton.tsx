import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'

import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'

function AddToLibraryButton({
  md5,
  setAddToLibraryFor
}: {
  md5: string
  setAddToLibraryFor: (id: string) => void
}): React.ReactElement {
  const { t } = useTranslation('modules.booksLibrary')
  const {
    entries: { data: entries },
    miscellaneous: { processes }
  } = useBooksLibraryContext()

  const icon = useMemo(() => {
    if (Object.keys(processes).includes(md5)) {
      return 'svg-spinners:180-ring'
    }

    if (
      typeof entries !== 'string' &&
      entries.some(entry => entry.md5 === md5)
    ) {
      return 'tabler:check'
    }

    return 'tabler:plus'
  }, [entries, md5, processes])

  const text = useMemo(() => {
    if (Object.keys(processes).includes(md5)) {
      return `${t('buttons.downloading')} (${processes[md5].percentage})`
    }

    if (
      typeof entries !== 'string' &&
      entries.some(entry => entry.md5 === md5)
    ) {
      return t('buttons.alreadyInLibrary')
    }

    return t('buttons.addToLibrary')
  }, [entries, md5, processes])

  return (
    <Button
      className="w-full xl:w-1/2"
      disabled={
        Object.keys(processes).includes(md5) ||
        (typeof entries !== 'string' &&
          entries.some(entry => entry.md5 === md5))
      }
      icon={icon}
      namespace="modules.booksLibrary"
      variant={
        Object.keys(processes).includes(md5) ||
        (typeof entries !== 'string' &&
          entries.some(entry => entry.md5 === md5))
          ? 'no-bg'
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
