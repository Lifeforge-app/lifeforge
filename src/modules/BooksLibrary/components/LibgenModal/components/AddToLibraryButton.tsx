import { t } from 'i18next'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
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

  return (
    <Button
      needTranslate={false}
      disabled={
        Object.keys(processes).includes(md5) ||
        (typeof entries !== 'string' &&
          entries.some(entry => entry.md5 === md5))
      }
      onClick={() => {
        setAddToLibraryFor(md5)
      }}
      icon={
        Object.keys(processes).includes(md5)
          ? 'svg-spinners:180-ring'
          : typeof entries !== 'string' &&
            entries.some(entry => entry.md5 === md5)
          ? 'tabler:check'
          : 'tabler:plus'
      }
      className="w-1/2"
    >
      {Object.keys(processes).includes(md5)
        ? `${t('button.downloading')} (${processes[md5].percentage})`
        : typeof entries !== 'string' &&
          entries.some(entry => entry.md5 === md5)
        ? t('button.alreadyInLibrary')
        : t('button.addToLibrary')}
    </Button>
  )
}

export default AddToLibraryButton
