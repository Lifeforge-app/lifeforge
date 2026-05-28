import clsx from 'clsx'
import type { CSSProperties, SetStateAction } from 'react'
import PhotoAlbum from 'react-photo-album'

import { Pagination } from '@components/navigation'
import { Scrollbar } from '@components/utilities'

import { type IPixabaySearchResult } from '../typescript/pixabay_interfaces'
import * as styles from './SearchResults.css'

export function SearchResults({
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
        page={page}
        totalPages={Math.ceil(results.total / 20)}
        onPageChange={handlePageChange}
      />
      <div className={styles.photoWrapper}>
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
                styles.photoButton,
                photo.fullResURL === file && styles.photoButtonSelected
              )}
              style={style as CSSProperties}
              onClick={() => {
                setFile(photo.fullResURL)
                setPreview(photo.src)
              }}
            >
              <img
                alt={alt}
                src={src}
                style={{ height: '100%', objectFit: 'cover', width: '100%' }}
              />
            </button>
          )}
          spacing={12}
        />
      </div>
      <Pagination
        className="mt-4"
        page={page}
        totalPages={Math.ceil(results.total / 20)}
        onPageChange={handlePageChange}
      />
    </Scrollbar>
  )
}

