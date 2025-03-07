import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import moment from 'moment'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import useThemeColors from '@hooks/useThemeColor'
import { IMovieSearchResult } from '@interfaces/movies_interfaces'

function TMDBResultItem({
  data,
  onAddToLibrary,
  isAdded
}: {
  data: IMovieSearchResult
  onAddToLibrary: (id: number) => Promise<void>
  isAdded: boolean
}): React.ReactElement {
  const { componentBgLighter } = useThemeColors()
  const [loading, setLoading] = useState(false)

  return (
    <div
      className={clsx(
        componentBgLighter,
        'p-4 rounded-md flex items-center gap-6 flex-col md:flex-row'
      )}
    >
      <div className="h-48 w-32 shrink-0 bg-bg-200 dark:bg-bg-800 relative isolate">
        <Icon
          className="size-18 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-bg-300 dark:text-bg-700 z-[-1]"
          icon="tabler:movie"
        />
        <img
          alt=""
          className="object-contain rounded-md"
          src={`http://image.tmdb.org/t/p/w154/${data.poster_path}`}
        />
      </div>
      <div className="w-full">
        <p className="font-semibold text-custom-500">
          {moment(data.release_date).year()}
        </p>
        <h1 className="text-xl font-semibold">{data.title}</h1>
        <p className="mt-2 line-clamp-2 text-bg-500">{data.overview}</p>
        <Button
          className="mt-4 w-full"
          disabled={isAdded}
          icon="tabler:plus"
          loading={loading}
          namespace="movies"
          variant={isAdded ? 'no-bg' : 'primary'}
          onClick={() => {
            setLoading(true)
            onAddToLibrary(data.id).finally(() => setLoading(false))
          }}
        >
          {isAdded ? 'Already in Library' : 'Add to Library'}
        </Button>
      </div>
    </div>
  )
}

export default TMDBResultItem
