import { GoBackButton, QueryWrapper } from 'lifeforge-ui'

import useAPIQuery from '@hooks/useAPIQuery'

import AddToLibraryButton from '../AddToLibraryButton'
import DataTable from './components/DataTable'
import TOC from './components/TOC'
import ThumbnailAndHashes from './components/ThumbnailAndHashes'

export interface BookDetailProps {
  image: string
  hashes: Record<string, string>
  title: string
  'Author(s)'?: string
  toc?: string
  descriptions?: string
  [key: string]: any
}

function Details({ id, onClose }: { id: string; onClose: () => void }) {
  const booksQuery = useAPIQuery<BookDetailProps>(
    `books-library/libgen/details/${id}`,
    ['books-library', 'libgen', 'details', id],
    Boolean(id)
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
                  <AddToLibraryButton book={data} />
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
