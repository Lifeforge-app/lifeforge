import { Box, Icon, colorWithOpacity } from '@lifeforge/ui'

import { useMovieItemContext } from '../contexts/MovieItemContext'

function MoviePoster() {
  const { data, type } = useMovieItemContext()

  return (
    <Box
      bg={{ base: 'bg-200', dark: colorWithOpacity('bg-800', '40%') }}
      flexShrink="0"
      height={type === 'grid' ? 'auto' : '16.5rem'}
      overflow="hidden"
      aspectRatio="27/40"
      position="relative"
      r="md"
      style={{ isolation: 'isolate' }}
      width={type === 'grid' ? '100%' : '12rem'}
    >
      <Box
        asChild
        left="50%"
        position="absolute"
        style={{ transform: 'translate(-50%, -50%)' }}
        top="50%"
        zIndex="-1"
      >
        <Icon
          color={{ base: 'bg-300', dark: 'bg-700' }}
          icon="tabler:movie"
          size="4.5em"
        />
      </Box>
      <Box
        asChild
        height="100%"
        r="md"
        style={{ objectFit: 'contain' }}
        width="100%"
      >
        <img alt="" src={data.poster} />
      </Box>
    </Box>
  )
}

export default MoviePoster
