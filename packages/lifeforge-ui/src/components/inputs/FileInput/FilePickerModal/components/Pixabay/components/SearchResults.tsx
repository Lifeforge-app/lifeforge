import { Pagination, Scrollbar } from '@components/utilities'
import clsx from 'clsx'
import type { SetStateAction } from 'react'
import PhotoAlbum from 'react-photo-album'

import { type IPixabaySearchResult } from '../typescript/pixabay_interfaces'

function SearchResults({
  results,
  page,
  setPage,
  file,
  setFile,
  setPreview,
  onSearch
}: {
  results: IPixabaySearchResult
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
  onSearch: (page: number) => Promise<void>
}) {
  function handlePageChange(newPage: SetStateAction<number>) {
    setPage(prev => {
      const updatedPage =
        typeof newPage === 'function' ? newPage(prev) : newPage

      onSearch(updatedPage).catch(console.error)

      return updatedPage
    })
  }

  return (
    <Scrollbar className="size-full min-h-[50vh] flex-1">
      <Pagination
        className="mb-4"
        currentPage={page}
        totalPages={Math.ceil(results.total / 20)}
        onPageChange={handlePageChange}
      />
      <div className="px-2">
        <PhotoAlbum
          layout="rows"
          photos={results.hits.map(image => ({
            src: image.thumbnail.url,
            width: image.thumbnail.width,
            height: image.thumbnail.height,
            key: image.id,
            fullResURL: image.imageURL
          }))}
          renderPhoto={({ photo, imageProps: { src, alt, style } }) => (
            <button
              className={clsx(
                'bg-bg-200 dark:bg-bg-800/50 ring-offset-bg-100 dark:ring-offset-bg-900 relative isolate block overflow-hidden rounded-md ring-2 ring-offset-2 transition-all',
                photo.fullResURL === file
                  ? 'ring-custom-500'
                  : 'hover:ring-bg-400 dark:hover:ring-bg-600 ring-transparent'
              )}
              style={style}
              onClick={() => {
                setFile(photo.fullResURL)
                setPreview(photo.src)
              }}
            >
              <img alt={alt} className="size-full object-cover" src={src} />
            </button>
          )}
          spacing={12}
        />
      </div>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={Math.ceil(results.total / 20)}
        onPageChange={handlePageChange}
      />
    </Scrollbar>
  )
}

export default SearchResults
