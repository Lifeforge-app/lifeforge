import { forgeController, forgeRouter } from '@functions/routes'
import COLLECTION_SCHEMAS from '@schema'
import { Location } from '@typescript/location.types'
import { z } from 'zod/v4'

const list = forgeController.query
  .description('Get all transaction templates')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('wallet__transaction_templates')
      .sort(['type', 'name'])
      .execute()
  )

const create = forgeController.mutation
  .description('Create a new transaction template')
  .input({
    body: COLLECTION_SCHEMAS.wallet__transaction_templates
      .omit({
        location_coords: true,
        location_name: true
      })
      .extend({
        location: Location
      })
  })
  .existenceCheck('body', {
    asset: 'wallet__assets',
    category: 'wallet__categories',
    ledgers: '[wallet__ledgers]'
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create
      .collection('wallet__transaction_templates')
      .data({
        ...body,
        location_coords: {
          lon: body.location?.location.longitude || 0,
          lat: body.location?.location.latitude || 0
        },
        location_name: body.location?.name || ''
      })
      .execute()
  )

const update = forgeController.mutation
  .description('Update an existing transaction template')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: COLLECTION_SCHEMAS.wallet__transaction_templates
      .omit({
        location_coords: true,
        location_name: true
      })
      .extend({
        location: Location
      })
  })
  .existenceCheck('query', {
    id: 'wallet__transaction_templates'
  })
  .existenceCheck('body', {
    asset: 'wallet__assets',
    category: 'wallet__categories',
    ledgers: '[wallet__ledgers]'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update
      .collection('wallet__transaction_templates')
      .id(id)
      .data({
        ...body,
        location_coords: {
          lon: body.location?.location.longitude || 0,
          lat: body.location?.location.latitude || 0
        },
        location_name: body.location?.name || ''
      })
      .execute()
  )

const remove = forgeController.mutation
  .description('Delete a transaction template')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wallet__transaction_templates'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('wallet__transaction_templates').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
