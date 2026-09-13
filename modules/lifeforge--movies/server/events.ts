import dayjs from 'dayjs'

import type { PBService } from '@lifeforge/pocketbase'

export default async function getEvents({
  pb,
  start,
  end
}: {
  pb: PBService<{}>
  start: string
  end: string
}) {
  return (
    (await pb.instance
      .collection('movies__entries')
      .getFullList({
        filter: `theatre_showtime >= "${start}" && theatre_showtime <= "${end}"`
      })
      .catch(() => [])) as any[]
  )
    .filter(e => e.theatre_showtime)
    .map(entry => ({
      id: entry.id,
      type: 'single' as const,
      title: entry.title,
      start: entry.theatre_showtime,
      end: dayjs(entry.theatre_showtime)
        .add(entry.duration || 0, 'minutes')
        .toISOString(),
      category: '_movie',
      calendar: '',
      location: entry.theatre_location ?? '',
      location_coords: entry.theatre_location_coords,
      description: `
  ![${entry.title}](http://image.tmdb.org/t/p/w300/${entry.poster})

  ### Movie Description:
  ${entry.overview}

  ### Theatre Number:
  ${entry.theatre_number}

  ### Seat Number:
  ${entry.theatre_seat}
        `,
      reference_link: `/movies?show-ticket=${entry.id}`
    }))
}
