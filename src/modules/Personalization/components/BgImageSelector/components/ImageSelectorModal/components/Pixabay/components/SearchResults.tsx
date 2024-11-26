import React from 'react'
import PhotoAlbum from 'react-photo-album'
import Pagination from '@components/Miscellaneous/Pagination'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import { type IPixabaySearchResult } from '@interfaces/pixabay_interfaces'

function SearchResults({
  results,
  page,
  setPage,
  file,
  setFile,
  onSearch
}: {
  results: IPixabaySearchResult
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  onSearch: (page: number) => Promise<void>
}): React.ReactElement {
  return (
    <Scrollbar className="size-full flex-1">
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
              }}
              className={`overflow-hidden rounded-md outline outline-2 transition-all ${
                photo.fullResURL === file
                  ? 'outline-custom-500'
                  : 'outline-transparent hover:outline-bg-500'
              }`}
              style={style}
            >
              <img src={src} alt={alt} />
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
