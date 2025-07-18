import { Icon } from '@iconify/react'
import clsx from 'clsx'
import prettyBytes from 'pretty-bytes'

import { BooksLibraryCollectionsSchemas, ISchemaWithPB } from 'shared/types'

import { useBooksLibraryContext } from '../../providers/BooksLibraryProvider'

function BookMeta({
  item,
  isGridView = false
}: {
  item:
    | ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>
    | Record<string, any>
  isGridView?: boolean
}) {
  const { languagesQuery } = useBooksLibraryContext()

  return (
    <div
      className={clsx(
        'text-bg-500 mt-4 flex w-full min-w-0 flex-wrap gap-2 text-sm',
        isGridView
          ? 'flex-col sm:flex-row sm:items-center'
          : 'flex-row items-center'
      )}
    >
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
          <p
            className={clsx(
              'text-bg-500 flex max-w-48 min-w-0 shrink-0 items-center whitespace-nowrap',
              isGridView ? 'w-full sm:w-auto' : 'w-auto'
            )}
          >
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
