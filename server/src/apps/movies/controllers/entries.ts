import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as entriesService from '../services/entries.service'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all movie entries')
  .input({})
  .callback(({ pb, query: { watched } }) =>
    entriesService.getAllEntries(pb, watched)
  )

const createEntryFromTMDB = forgeController
  .route('POST /:id')
  .description('Create a movie entry from TMDB')
  .input({})
  .callback(({ pb, params: { id } }) =>
    entriesService.createEntryFromTMDB(pb, id)
  )
  .statusCode(201)

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a movie entry')
  .input({})
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id } }) => entriesService.deleteEntry(pb, id))
  .statusCode(204)

const toggleWatchStatus = forgeController
  .route('PATCH /watch-status/:id')
  .description('Toggle watch status of a movie entry')
  .input({})
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id } }) =>
    entriesService.toggleWatchStatus(pb, id)
  )

export default forgeRouter({
  getAllEntries,
  createEntryFromTMDB,
  deleteEntry,
  toggleWatchStatus
})
