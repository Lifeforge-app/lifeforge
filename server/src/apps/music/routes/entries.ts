import { forgeController } from '@functions/routes'

import * as EntriesService from '../services/entries.service'

const getAllEntries = forgeController.query
  .description('Get all music entries')
  .input({})
  .callback( ({ pb }) => pb.getFullList.collection(''))

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update a music entry')
  .input({})
  .callback(
    async ({ pb, params: { id }, body }) =>
      await EntriesService.updateEntry(pb, id, body)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a music entry')
  .input({})
  .existenceCheck('params', {
    id: 'music__entries'
  })
  .callback(async ({ pb, params: { id } }) =>
    EntriesService.deleteEntry(pb, id)
  )
  .statusCode(204)

const toggleFavorite = forgeController
  .route('POST /favourite/:id')
  .description('Toggle favorite status of a music entry')
  .input({})
  .existenceCheck('params', {
    id: 'music__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await EntriesService.toggleFavorite(pb, id)
  )

export default forgeRouter({
  getAllEntries,
  updateEntry,
  deleteEntry,
  toggleFavorite
})
