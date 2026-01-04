import { PBService } from '@functions/database'
import moment from 'moment'

export default async function getEvents({
  pb,
  start,
  end
}: {
  pb: PBService
  start: string
  end: string
}) {
  return (
    await pb.getFullList
      .collection('movies__entries')
      .filter([
        {
          field: 'theatre_showtime',
          operator: '>=',
          value: start
        },
        { field: 'theatre_showtime', operator: '<=', value: end }
      ])
      .execute()
      .catch(() => [])
  ).map(entry => ({
    id: entry.id,
    type: 'single' as const,
    title: entry.title,
    start: entry.theatre_showtime,
    end: moment(entry.theatre_showtime)
      .add(entry.duration, 'minutes')
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
