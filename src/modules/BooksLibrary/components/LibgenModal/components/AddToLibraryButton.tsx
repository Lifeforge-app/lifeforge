import { t } from 'i18next'
import React, { useMemo } from 'react'
import { Button } from '@components/buttons'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'

function AddToLibraryButton({
  md5,
  setAddToLibraryFor
}: {
  md5: string
  setAddToLibraryFor: (id: string) => void
}): React.ReactElement {
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
      return `${t('button.downloading')} (${processes[md5].percentage})`
    }

    if (
      typeof entries !== 'string' &&
      entries.some(entry => entry.md5 === md5)
    ) {
      return t('button.alreadyInLibrary')
    }

    return t('button.addToLibrary')
  }, [entries, md5, processes])

  return (
    <Button
      needTranslate={false}
      disabled={
        Object.keys(processes).includes(md5) ||
        (typeof entries !== 'string' &&
          entries.some(entry => entry.md5 === md5))
      }
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
      icon={icon}
      className="w-full xl:w-1/2"
    >
      {text}
    </Button>
  )
}

export default AddToLibraryButton
