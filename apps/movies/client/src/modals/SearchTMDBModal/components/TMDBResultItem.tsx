import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import type { TMDBSearchResults } from '..'

function TMDBResultItem({
  data,
  isAdded,
  onAddToLibrary
}: {
  data: TMDBSearchResults['results'][number]
  isAdded: boolean
  onAddToLibrary: () => Promise<void>
}) {
  const addToLibraryMutation = useMutation(
    forgeAPI.movies.entries.create
      .input({ id: data.id.toString() })
      .mutationOptions({
        onSuccess: async () => {
          await onAddToLibrary()
        },
        onError: (error: any) => {
          toast.error(
            `Failed to add movie: ${error.message || 'Unknown error'}`
          )
        }
      })
  )

  const [loading, onSubmit] = usePromiseLoading(() =>
    addToLibraryMutation.mutateAsync({})
  )

  return (
    <div className="component-bg-lighter shadow-custom flex flex-col items-center gap-6 rounded-md p-4 md:flex-row">
      <div className="bg-bg-200 dark:bg-bg-800 relative isolate h-48 w-32 shrink-0">
        <Icon
          className="text-bg-300 dark:text-bg-700 absolute top-1/2 left-1/2 z-[-1] size-18 -translate-x-1/2 -translate-y-1/2 transform"
          icon="tabler:movie"
        />
        <img
          alt=""
          className="rounded-md object-contain"
          src={`http://image.tmdb.org/t/p/w154/${data.poster_path}`}
        />
      </div>
      <div className="w-full">
        <p className="text-custom-500 font-semibold">
          {dayjs(data.release_date).year()}
        </p>
        <h1 className="text-xl font-semibold">
          {data.title}{' '}
          <span className="text-bg-500 text-base font-medium">
            ({data.original_title})
          </span>
        </h1>
        <p className="text-bg-500 mt-2 line-clamp-2">{data.overview}</p>
        <Button
          className="mt-4 w-full"
          disabled={isAdded}
          icon="tabler:plus"
          loading={loading}
          namespace="apps.movies"
          variant={isAdded ? 'plain' : 'primary'}
          onClick={onSubmit}
        >
          {isAdded ? 'Already in Library' : 'Add to Library'}
        </Button>
      </div>
    </div>
  )
}

export default TMDBResultItem
