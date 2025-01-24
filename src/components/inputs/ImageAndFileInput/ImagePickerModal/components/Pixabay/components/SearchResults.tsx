import React from 'react'
import PhotoAlbum from 'react-photo-album'
import Pagination from '@components/utilities/Pagination'
import Scrollbar from '@components/utilities/Scrollbar'
import { type IPixabaySearchResult } from '@interfaces/pixabay_interfaces'

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
}): React.ReactElement {
  return (
    <Scrollbar className="size-full min-h-[50vh] flex-1">
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(results.total / 20)}
        onPageChange={page => {
          setPage(page)
          onSearch(page).catch(console.error)
        }}
        className="mb-4"
      />
      <div className="px-2">
        <PhotoAlbum
          layout="rows"
          spacing={8}
          photos={results.hits.map(image => ({
            src: image.thumbnail.url,
            width: image.thumbnail.width,
            height: image.thumbnail.height,
            key: image.id,
            fullResURL: image.imageURL
          }))}
          renderPhoto={({ photo, imageProps: { src, alt, style } }) => (
            <div
              onClick={() => {
                setFile(photo.fullResURL)
                setPreview(photo.src)
              }}
              className={`relative isolate overflow-hidden rounded-md bg-bg-200 outline outline-2 transition-all dark:bg-bg-800/50 ${
                photo.fullResURL === file
                  ? 'outline-custom-500'
                  : 'outline-transparent hover:outline-bg-500'
              }`}
              style={style}
            >
              <img src={src} alt={alt} className="size-full object-cover" />
            </div>
          )}
        />
      </div>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(results.total / 20)}
        onPageChange={page => {
          setPage(page)
          onSearch(page).catch(console.error)
        }}
        className="mt-4"
      />
    </Scrollbar>
  )
}

export default SearchResults
