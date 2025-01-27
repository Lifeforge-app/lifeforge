import React from 'react'
import { GoBackButton } from '@components/buttons'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import DataTable from './components/DataTable'
import ThumbnailAndHashes from './components/ThumbnailAndHashes'
import TOC from './components/TOC'
import AddToLibraryButton from '../AddToLibraryButton'

export interface BookDetailProps {
  image: string
  hashes: Record<string, string>
  title: string
  'Author(s)'?: string
  toc?: string
  descriptions?: string
  [key: string]: any
}

function Details({
  id,
  onClose,
  setAddToLibraryFor
}: {
  id: string
  onClose: () => void
  setAddToLibraryFor: (id: string) => void
}): React.ReactElement {
  const [book] = useFetch<BookDetailProps>(
    `books-library/libgen/details/${id}`,
    Boolean(id)
  )

  return (
    <>
      <GoBackButton onClick={onClose} />
      <div className="mt-4">
        <APIFallbackComponent data={book}>
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
                              href={`/search?req=${encodeURIComponent(
                                author.trim()
                              )}&column=author`}
                              className="text-custom-500 hover:text-custom-600"
                            >
                              {author.trim()}
                            </a>
                            {i < arr.length - 1 && ', '}
                          </span>
                        ))}
                    </div>
                  </div>
                  <AddToLibraryButton
                    md5={id}
                    setAddToLibraryFor={setAddToLibraryFor}
                  />
                </div>
                <DataTable data={data} />
                <TOC data={data} />
              </div>
            </section>
          )}
        </APIFallbackComponent>
      </div>
    </>
  )
}

export default Details
