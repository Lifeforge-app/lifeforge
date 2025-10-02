import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import humanNumber from 'human-number'
import prettyBytes from 'pretty-bytes'

import { type BooksLibraryEntry } from '../../providers/BooksLibraryProvider'

function BookMeta({
  item,
  isGridView = false
}: {
  item: BooksLibraryEntry | Record<string, any>
  isGridView?: boolean
}) {
  const languagesQuery = useQuery(
    forgeAPI.booksLibrary.languages.list.queryOptions()
  )

  return (
    <div
      className={clsx(
        'text-bg-500 mt-4 flex w-full min-w-0 flex-wrap gap-2 text-sm',
        isGridView
          ? 'flex-col sm:flex-row sm:items-center'
          : 'flex-row items-center'
      )}
    >
      {item.page_count !== 0 && (
        <>
          <p className="text-bg-500 flex shrink-0 items-center whitespace-nowrap">
            <Icon className="mr-1 size-4" icon="tabler:file-text" />
            {humanNumber(item.page_count)} pages
          </p>
          <Icon
            className={clsx('size-1', isGridView && 'hidden sm:block')}
            icon="tabler:circle-filled"
          />
        </>
      )}
      {item.word_count !== 0 && (
        <>
          <p className="text-bg-500 flex shrink-0 items-center whitespace-nowrap">
            <Icon className="mr-1 size-4" icon="tabler:text-size" />
            {humanNumber(item.word_count)} words
          </p>
          <Icon
            className={clsx('size-1', isGridView && 'hidden sm:block')}
            icon="tabler:circle-filled"
          />
        </>
      )}
      {languagesQuery.data &&
        (() => {
          const langs = languagesQuery.data.filter(language =>
            item.languages?.includes(language.id)
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
          <p className="text-bg-500 flex shrink-0 items-center whitespace-nowrap">
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
          <p className="text-bg-500 flex w-full max-w-[80vw] min-w-0 shrink-0 items-center whitespace-nowrap sm:w-auto sm:max-w-48">
            <Icon className="mr-1 size-4 shrink-0" icon="tabler:user" />
            <span className="w-full max-w-44 min-w-0 truncate">
              {item.publisher}
            </span>
          </p>
          <Icon
            className={clsx('size-1', isGridView && 'hidden sm:block')}
            icon="tabler:circle-filled"
          />
        </>
      )}
      <p className="text-bg-500 flex shrink-0 items-center whitespace-nowrap">
        <Icon className="mr-1 size-4" icon="tabler:dimensions" />
        {prettyBytes(+item.size || 0)}
      </p>
      <Icon
        className={clsx('size-1', isGridView && 'hidden sm:block')}
        icon="tabler:circle-filled"
      />
      <p className="text-bg-500 flex shrink-0 items-center whitespace-nowrap">
        <Icon className="mr-1 size-4" icon="tabler:file-text" />
        {item.extension}
      </p>
    </div>
  )
}

export default BookMeta
