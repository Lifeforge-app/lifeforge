import type { CSSProperties, SetStateAction } from 'react'
import PhotoAlbum from 'react-photo-album'

import { Pagination } from '@/components/navigation'
import { Box, Ring, Transition } from '@/components/primitives'
import { Scrollbar } from '@/components/utilities'

import { type IPixabaySearchResult } from '../typescript/pixabay_interfaces'

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
    <Box asChild flex="1" height="100%" minHeight="50vh" width="100%">
      <Scrollbar>
        <Box asChild mb="md">
          <Pagination
            page={page}
            totalPages={Math.ceil(results.total / 20)}
            onPageChange={handlePageChange}
          />
        </Box>
        <Box px="sm">
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
              <Transition>
                <Ring
                  ringColor={
                    photo.fullResURL === file
                      ? 'custom-500'
                      : {
                          hover: 'bg-400',
                          darkHover: 'bg-600'
                        }
                  }
                  ringOffsetWidth="2px"
                  ringWidth="2px"
                >
                  <Box
                    as="button"
                    bg={{ base: 'bg-200', dark: 'bg-800' }}
                    overflow="hidden"
                    r="md"
                    style={style as CSSProperties}
                    onClick={() => {
                      setFile(photo.fullResURL)
                      setPreview(photo.src)
                    }}
                  >
                    <img
                      alt={alt}
                      src={src}
                      style={{
                        height: '100%',
                        objectFit: 'cover',
                        width: '100%'
                      }}
                    />
                  </Box>
                </Ring>
              </Transition>
            )}
            spacing={12}
          />
        </Box>
        <Box asChild mt="md">
          <Pagination
            page={page}
            totalPages={Math.ceil(results.total / 20)}
            onPageChange={handlePageChange}
          />
        </Box>
      </Scrollbar>
    </Box>
  )
}
