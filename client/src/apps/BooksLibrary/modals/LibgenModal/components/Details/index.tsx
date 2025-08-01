import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { GoBackButton, QueryWrapper } from 'lifeforge-ui'
import type { InferOutput } from 'shared'

import AddToLibraryButton from '../AddToLibraryButton'
import DataTable from './components/DataTable'
import TOC from './components/TOC'
import ThumbnailAndHashes from './components/ThumbnailAndHashes'

export type BookDetailProps = InferOutput<
  typeof forgeAPI.booksLibrary.libgen.getBookDetails
>

function Details({
  md5,
  onClose,
  provider
}: {
  md5: string
  onClose: () => void
  provider: string
}) {
  const booksQuery = useQuery(
    forgeAPI.booksLibrary.libgen.getBookDetails.input({ md5 }).queryOptions({
      enabled: Boolean(md5)
    })
  )

  return (
    <>
      <GoBackButton onClick={onClose} />
      <div className="mt-4">
        <QueryWrapper query={booksQuery}>
          {data => (
            <section className="flex flex-1 flex-col justify-center gap-8 md:flex-row">
              <ThumbnailAndHashes data={data} />
              <div className="flex size-full flex-col md:w-3/5 lg:w-4/5">
                <div className="flex-between flex flex-col gap-8 xl:flex-row">
                  <div>
                    <h1 className="text-3xl font-medium">{data.title}</h1>
                    <div className="mt-2 flex flex-wrap">
                      {data['Author(s)']
                        ?.split(/[,;]/g)
                        .map((author, i, arr) => (
                          <span key={i}>
                            <a
                              className="text-custom-500 hover:text-custom-600"
                              href={`/search?req=${encodeURIComponent(
                                author.trim()
                              )}&column=author`}
                            >
                              {author.trim()}
                            </a>
                            {i < arr.length - 1 && ', '}
                          </span>
                        ))}
                    </div>
                  </div>
                  <AddToLibraryButton book={data} provider={provider} />
                </div>
                <DataTable data={data} />
                <TOC data={data} />
              </div>
            </section>
          )}
        </QueryWrapper>
      </div>
    </>
  )
}

export default Details
