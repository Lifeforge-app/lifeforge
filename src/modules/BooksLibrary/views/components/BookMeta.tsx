import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import { cleanFileSize } from '@utils/strings'

function BookMeta({
  item,
  isGridView = false
}: {
  item: IBooksLibraryEntry | Record<string, any>
  isGridView?: boolean
}): React.ReactElement {
  const {
    languages: { data: languages }
  } = useBooksLibraryContext()

  return (
    <div
      className={clsx(
        'mt-4 flex w-full min-w-0 flex-wrap gap-2 text-sm text-bg-500',
        isGridView
          ? 'flex-col sm:flex-row sm:items-center'
          : 'flex-row items-center'
      )}
    >
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
                      <Icon className="size-4" icon={lang.icon} />
                      {lang.name}
                    </div>
                    {i !== langs.length - 1 && (
                      <Icon
                        key={`separator-${lang.id}`}
                        className={clsx(
                          'size-1',
                          isGridView && 'hidden sm:block'
                        )}
                        icon="tabler:circle-filled"
                      />
                    )}
                  </div>
                ))}
                <Icon
                  className={clsx('size-1', isGridView && 'hidden sm:block')}
                  icon="tabler:circle-filled"
                />
              </>
            )
          )
        })()}
      {item.year_published !== 0 && (
        <>
          <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
            <Icon className="mr-1 size-4" icon="tabler:clock" />
            {item.year_published}
          </p>
          <Icon
            className={clsx('size-1', isGridView && 'hidden sm:block')}
            icon="tabler:circle-filled"
          />
        </>
      )}
      {item.publisher !== '' && (
        <>
          <p
            className={clsx(
              'flex min-w-0 max-w-48 shrink-0 items-center whitespace-nowrap text-bg-500',
              isGridView ? 'w-full sm:w-auto' : 'w-auto'
            )}
          >
            <Icon className="mr-1 size-4 shrink-0" icon="tabler:user" />
            <span className="w-full min-w-0 max-w-44 truncate">
              {item.publisher}
            </span>
          </p>
          <Icon
            className={clsx('size-1', isGridView && 'hidden sm:block')}
            icon="tabler:circle-filled"
          />
        </>
      )}
      <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
        <Icon className="mr-1 size-4" icon="tabler:dimensions" />
        {cleanFileSize(item.size)}
      </p>
      <Icon
        className={clsx('size-1', isGridView && 'hidden sm:block')}
        icon="tabler:circle-filled"
      />
      <p className="flex shrink-0 items-center whitespace-nowrap text-bg-500">
        <Icon className="mr-1 size-4" icon="tabler:file-text" />
        {item.extension}
      </p>
    </div>
  )
}

export default BookMeta
