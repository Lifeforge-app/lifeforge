import { Icon } from '@iconify/react'
import React from 'react'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import { cleanFileSize } from '@utils/strings'

function BookMeta({
  item
}: {
  item: IBooksLibraryEntry | Record<string, any>
}): React.ReactElement {
  const {
    languages: { data: languages }
  } = useBooksLibraryContext()

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-bg-500">
      {typeof languages !== 'string' &&
        (() => {
          const langs = languages.filter(language =>
            item.languages.includes(language.id)
          )

          return (
            langs.length > 0 && (
              <>
                {langs.map((lang, i) => (
                  <div key={lang.id}>
                    <div className="flex items-center gap-1">
                      <Icon icon={lang.icon} className="size-4" />
                      {lang.name}
                    </div>
                    {i !== langs.length - 1 && (
                      <Icon
                        key={`separator-${lang.id}`}
                        icon="tabler:circle-filled"
                        className="size-1"
                      />
                    )}
                  </div>
                ))}
                <Icon icon="tabler:circle-filled" className="size-1" />
              </>
            )
          )
        })()}
      {item.year_published !== 0 && (
        <>
          <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
            <Icon icon="tabler:clock" className="mr-1 size-4" />
            {item.year_published}
          </p>
          <Icon icon="tabler:circle-filled" className="size-1" />
        </>
      )}
      {item.publisher !== '' && (
        <>
          <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
            <Icon icon="tabler:user" className="mr-1 size-4" />
            <span className="max-w-44 truncate">{item.publisher}</span>
          </p>
          <Icon icon="tabler:circle-filled" className="size-1" />
        </>
      )}
      <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
        <Icon icon="tabler:dimensions" className="mr-1 size-4" />
        {cleanFileSize(item.size)}
      </p>
      <Icon icon="tabler:circle-filled" className="size-1" />
      <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
        <Icon icon="tabler:file-text" className="mr-1 size-4" />
        {item.extension}
      </p>
    </div>
  )
}

export default BookMeta
