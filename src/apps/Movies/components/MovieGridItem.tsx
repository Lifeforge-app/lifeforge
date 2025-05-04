import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import useComponentBg from '@hooks/useComponentBg'

import { useModalStore } from '../../../core/modals/useModalStore'

function MovieGridItem({
  data,
  onToggleWatched,
  type
}: {
  data: IMovieEntry
  onToggleWatched: (id: string) => Promise<void>
  type: 'grid' | 'list'
}) {
  const open = useModalStore(state => state.open)
  const { componentBg } = useComponentBg()
  const [toggleWatchedLoading, setToggleWatchedLoading] = useState(false)

  const handleShowTicket = useCallback(() => {
    open('movies.showTicket', {
      entry: data
    })
  }, [data, open])

  const handleUpdateTicket = useCallback(() => {
    open('movies.modifyTicket', {
      existedData: data,
      type: data.ticket_number ? 'update' : 'create'
    })
  }, [data])

  const handleDeleteTicket = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: '/movies/entries',
      data: data,
      itemName: 'movie',
      nameKey: 'title',
      queryKey: ['movies', 'entries']
    })
  }, [data])

  return (
    <div
      className={clsx(
        componentBg,
        'shadow-custom relative flex items-center gap-6 rounded-md p-6',
        type === 'grid' ? 'flex-col' : 'flex-col md:flex-row'
      )}
    >
      <div className="bg-bg-200 dark:bg-bg-800 relative isolate flex h-66 w-48 shrink-0 items-center justify-center overflow-hidden rounded-md">
        <Icon
          className="text-bg-300 dark:text-bg-700 absolute top-1/2 left-1/2 z-[-1] size-18 -translate-x-1/2 -translate-y-1/2 transform"
          icon="tabler:movie"
        />
        <img
          alt=""
          className="h-full w-full rounded-md object-cover"
          src={`http://image.tmdb.org/t/p/w300/${data.poster}`}
        />
      </div>
      <div className="flex w-full flex-1 flex-col">
        <p className="text-custom-500 mb-1 font-semibold">
          {dayjs(data.release_date).year()}
        </p>
        <h1 className="text-xl font-semibold">
          {data.title}
          <span className="text-bg-500 ml-1 text-base font-medium">
            ({data.original_title})
          </span>
        </h1>
        <p className="text-bg-500 mt-2 line-clamp-2">{data.overview}</p>
        <div className="mt-4 flex-1">
          <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
            <div className="space-y-2">
              <div className="text-bg-500 flex items-center gap-2 font-medium">
                <Icon className="size-5" icon="tabler:category" />
                Genres
              </div>
              <div>{data.genres.join(', ')}</div>
            </div>
            <div className="space-y-2">
              <div className="text-bg-500 flex items-center gap-2 font-medium">
                <Icon className="size-5" icon="tabler:calendar" />
                Release Date
              </div>
              <div>
                {data.release_date
                  ? dayjs(data.release_date).format('DD MMM YYYY')
                  : 'TBA'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-bg-500 flex items-center gap-2 font-medium">
                <Icon className="size-5" icon="tabler:clock" />
                Duration
              </div>
              <div>
                {dayjs
                  .duration(data.duration, 'minutes')
                  .format('H [h] mm [m]')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-bg-500 flex items-center gap-2 font-medium">
                <Icon className="size-5" icon="uil:globe" />
                Language
              </div>
              <div>{data.language}</div>
            </div>
            <div className="space-y-2">
              <div className="text-bg-500 flex items-center gap-2 font-medium">
                <Icon className="size-5" icon="tabler:flag" />
                Countries
              </div>
              <div className="flex items-center gap-4">
                {data.countries.map((country, index) => (
                  <div
                    key={`country-${index}-${country}`}
                    className="flex items-center gap-2"
                  >
                    <Icon
                      className="size-5"
                      icon={`circle-flags:${country.toLowerCase()}`}
                    />
                    {country}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'mt-6 flex gap-2',
            type === 'grid' ? 'flex-col' : 'flex-col md:flex-row'
          )}
        >
          {data.is_watched ? (
            <Button
              disabled
              className="w-full"
              icon="tabler:check"
              loading={toggleWatchedLoading}
              namespace="apps.movies"
              variant="secondary"
            >
              Watched
            </Button>
          ) : (
            <Button
              className="w-full"
              icon="tabler:check"
              loading={toggleWatchedLoading}
              namespace="apps.movies"
              variant="secondary"
              onClick={() => {
                setToggleWatchedLoading(true)
                onToggleWatched(data.id).finally(() => {
                  setToggleWatchedLoading(false)
                })
              }}
            >
              Mark as Watched
            </Button>
          )}
          {data.ticket_number && (
            <Button
              className="w-full"
              icon="tabler:ticket"
              namespace="apps.movies"
              onClick={handleShowTicket}
            >
              Show Ticket
            </Button>
          )}
        </div>
      </div>
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
      >
        {data.is_watched && (
          <MenuItem
            icon="tabler:eye-off"
            namespace="apps.movies"
            text="Mark as Unwatched"
            onClick={() => {
              setToggleWatchedLoading(true)
              onToggleWatched(data.id).finally(() => {
                setToggleWatchedLoading(false)
              })
            }}
          />
        )}
        <MenuItem
          icon="tabler:ticket"
          namespace="apps.movies"
          text={data.ticket_number ? 'Update Ticket' : 'Add Ticket'}
          onClick={handleUpdateTicket}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteTicket}
        />
      </HamburgerMenu>
    </div>
  )
}

export default MovieGridItem
