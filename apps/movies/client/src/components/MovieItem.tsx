import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  ItemWrapper
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'
import { usePersonalization, usePromiseLoading } from 'shared'

import ModifyTicketModal from '../modals/ModifyTicketModal'
import ShowTicketModal from '../modals/ShowTicketModal'

dayjs.extend(duration)
dayjs.extend(relativeTime)

function MovieItem({
  data,
  type
}: {
  data: InferOutput<typeof forgeAPI.movies.entries.list>['entries'][number]
  type: 'grid' | 'list'
}) {
  const queryClient = useQueryClient()

  const { t } = useTranslation('apps.movies')

  const { language } = usePersonalization()

  const open = useModalStore(state => state.open)

  const toggleWatchedMutation = useMutation(
    forgeAPI.movies.entries.toggleWatchStatus
      .input({
        id: data.id
      })
      .mutationOptions({
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['movies', 'entries']
          })
        },
        onError: () => {
          toast.error('Failed to mark movie as watched.')
        }
      })
  )

  const [toggleWatchedLoading, handleToggleWatched] = usePromiseLoading(() =>
    toggleWatchedMutation.mutateAsync({})
  )

  const updateMovieDataMutation = useMutation(
    forgeAPI.movies.entries.update.input({ id: data.id }).mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['movies', 'entries']
        })

        toast.success('Movie data updated successfully.')
      },
      onError: () => {
        toast.error('Failed to update movie data.')
      }
    })
  )

  const [updateMovieDataLoading, handleUpdateMovieData] = usePromiseLoading(
    () => updateMovieDataMutation.mutateAsync({})
  )

  const handleShowTicket = useCallback(() => {
    open(ShowTicketModal, {
      entry: data
    })
  }, [data, open])

  const handleUpdateTicket = useCallback(() => {
    open(ModifyTicketModal, {
      initialData: data,
      type: data.ticket_number ? 'update' : 'create'
    })
  }, [data])

  const deleteMutation = useMutation(
    forgeAPI.movies.entries.remove.input({ id: data.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movies'] })
      },
      onError: () => {
        toast.error('Failed to delete movie entry')
      }
    })
  )

  const handleDeleteTicket = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Movie',
      description: 'Are you sure you want to delete this movie?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [data])

  return (
    <ItemWrapper
      as="li"
      className={clsx(
        'flex items-center gap-6',
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
              <div className="flex items-center gap-3">
                {data.countries.map((country: string, index: number) => (
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
          {!data.is_watched && (
            <Button
              className="w-full"
              icon="tabler:check"
              loading={toggleWatchedLoading}
              namespace="apps.movies"
              variant="secondary"
              onClick={handleToggleWatched}
            >
              Mark as Watched
            </Button>
          )}
          {data.ticket_number && (
            <Button
              className="w-full"
              icon="tabler:ticket"
              namespace="apps.movies"
              variant={data.is_watched ? 'secondary' : 'primary'}
              onClick={handleShowTicket}
            >
              Show Ticket
            </Button>
          )}
          {data.is_watched && (
            <div className="flex-center text-bg-500 mt-4 mb-2 w-full gap-2">
              <Icon className="size-5" icon="tabler:check" />
              {t('misc.watched', {
                date: dayjs(data.watch_date).locale(language).fromNow()
              })}
            </div>
          )}
        </div>
      </div>
      <ContextMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
      >
        {data.is_watched && (
          <ContextMenuItem
            icon="tabler:eye-off"
            label="Mark as Unwatched"
            namespace="apps.movies"
            onClick={handleToggleWatched}
          />
        )}
        <ContextMenuItem
          icon="tabler:ticket"
          label={data.ticket_number ? 'Update Ticket' : 'Add Ticket'}
          namespace="apps.movies"
          onClick={handleUpdateTicket}
        />
        <ContextMenuItem
          icon="tabler:refresh"
          label="Update Movie Data"
          loading={updateMovieDataLoading}
          namespace="apps.movies"
          shouldCloseMenuOnClick={false}
          onClick={handleUpdateMovieData}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteTicket}
        />
      </ContextMenu>
    </ItemWrapper>
  )
}

export default MovieItem
