import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { IMovieEntry } from '@interfaces/movies_interfaces'

function MovieItem({
  data,
  onModifyTicket,
  onShowTicket,
  onDelete,
  type
}: {
  data: IMovieEntry
  onModifyTicket: (type: 'create' | 'update', entry: IMovieEntry) => void
  onShowTicket: (id: string) => void
  onDelete: (entry: IMovieEntry) => void
  type: 'grid' | 'list'
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={clsx(
        componentBg,
        'p-6 rounded-md flex gap-6 items-center relative',
        type === 'grid' ? 'flex-col' : 'flex-col md:flex-row'
      )}
    >
      <div className="h-66 w-48 flex items-center rounded-md overflow-hidden justify-center shrink-0 bg-bg-200 dark:bg-bg-800 relative isolate">
        <Icon
          className="size-18 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-bg-300 dark:text-bg-700 z-[-1]"
          icon="tabler:movie"
        />
        <img
          alt=""
          className="object-cover rounded-md w-full h-full"
          src={`http://image.tmdb.org/t/p/w300/${data.poster}`}
        />
      </div>
      <div className="w-full flex flex-col flex-1">
        <p className="font-semibold text-custom-500 mb-1">
          {moment(data.release_date).year()}
        </p>
        <h1 className="text-xl font-semibold">
          {data.title}
          <span className="text-base font-medium text-bg-500">
            {' '}
            ({data.original_title})
          </span>
        </h1>
        <p className="mt-2 line-clamp-2 text-bg-500">{data.overview}</p>
        <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-bg-500">
              <Icon className="size-5" icon="tabler:category" />
              Genres
            </div>
            <div>{data.genres.join(', ')}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-bg-500">
              <Icon className="size-5" icon="tabler:calendar" />
              Release Date
            </div>
            <div>
              {data.release_date
                ? moment(data.release_date).format('DD MMM YYYY')
                : 'TBA'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-bg-500">
              <Icon className="size-5" icon="tabler:clock" />
              Duration
            </div>
            <div>
              {moment.duration(data.duration, 'minutes').get('hours')}h{' '}
              {moment.duration(data.duration, 'minutes').get('minutes')}m
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-bg-500">
              <Icon className="size-5" icon="uil:globe" />
              Language
            </div>
            <div>{data.language}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium text-bg-500">
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
        <div
          className={clsx(
            'flex mt-6 gap-2',
            type === 'grid' ? 'flex-col' : 'flex-col md:flex-row'
          )}
        >
          <Button
            className="w-full"
            icon="tabler:check"
            namespace="modules.movies"
            variant="secondary"
          >
            Mark as Watched
          </Button>
          {data.ticket_number && (
            <Button
              className="w-full"
              icon="tabler:ticket"
              namespace="modules.movies"
              onClick={() => onShowTicket(data.id)}
            >
              Show Ticket
            </Button>
          )}
        </div>
      </div>
      <HamburgerMenu className="absolute top-4 right-4">
        <MenuItem
          icon="tabler:ticket"
          namespace="modules.movies"
          text={data.ticket_number ? 'Update Ticket' : 'Add Ticket'}
          onClick={() => {
            onModifyTicket(data.ticket_number ? 'update' : 'create', data)
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => onDelete(data)}
        />
      </HamburgerMenu>
    </div>
  )
}

export default MovieItem
