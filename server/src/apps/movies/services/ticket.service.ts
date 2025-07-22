import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { MoviesCollectionsSchemas } from 'shared/types/collections'
export const updateTicket = (
  pb: PocketBase,
  id: string,
  ticketData
): Promise<ISchemaWithPB<MoviesCollectionsSchemas.IEntry>> => {
  const finalData: Partial<MoviesCollectionsSchemas.IEntry> = {
    ...ticketData,
    theatre_location: ticketData.theatre_location?.name,
    theatre_location_coords: {
      lat: ticketData.theatre_location?.location.latitude || 0,
      lon: ticketData.theatre_location?.location.longitude || 0
    }
  }

  return pb
    .collection('movies__entries')
    .update<ISchemaWithPB<MoviesCollectionsSchemas.IEntry>>(id, finalData)
}

export const clearTicket = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb
    .collection('movies__entries')
    .update<ISchemaWithPB<MoviesCollectionsSchemas.IEntry>>(id, {
      ticket_number: '',
      theatre_location: '',
      theatre_number: '',
      theatre_seat: '',
      theatre_showtime: ''
    })
}
