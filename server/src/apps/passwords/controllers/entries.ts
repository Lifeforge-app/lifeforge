import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { v4 } from 'uuid'

import * as EntriesService from '../services/entries.service'

export let challenge = v4()

setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

const getChallenge = forgeController
  .route('GET /challenge')
  .description('Get current challenge for password operations')
  .input({})
  .callback(async () => challenge)

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all password entries')
  .input({})
  .callback(async ({ pb }) => await EntriesService.getAllEntries(pb))

const createEntry = forgeController
  .route('POST /')
  .description('Create a new password entry')
  .input({})
  .callback(
    async ({ pb, body }) =>
      await EntriesService.createEntry(pb, body, challenge)
  )
  .statusCode(201)

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update a password entry')
  .input({})
  .existenceCheck('params', {
    id: 'passwords__entries'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await EntriesService.updateEntry(pb, id, body, challenge)
  )

const decryptEntry = forgeController
  .route('POST /decrypt/:id')
  .description('Decrypt a password entry')
  .input({})
  .existenceCheck('params', {
    id: 'passwords__entries'
  })
  .callback(
    async ({ pb, params: { id }, query: { master } }) =>
      await EntriesService.decryptEntry(pb, id, master, challenge)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a password entry')
  .input({})
  .existenceCheck('params', {
    id: 'passwords__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await EntriesService.deleteEntry(pb, id)
  )
  .statusCode(204)

const togglePin = forgeController
  .route('POST /pin/:id')
  .description('Toggle pin status of a password entry')
  .input({})
  .existenceCheck('params', {
    id: 'passwords__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await EntriesService.togglePin(pb, id)
  )

export default forgeRouter({
  getChallenge,
  getAllEntries,
  createEntry,
  updateEntry,
  decryptEntry,
  deleteEntry,
  togglePin
})
