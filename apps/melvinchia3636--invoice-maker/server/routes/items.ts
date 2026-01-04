import { SCHEMAS } from '@schema'
import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'

const listByInvoice = forgeController
  .query()
  .description('List all items for an invoice')
  .input({
    query: z.object({
      invoiceId: z.string()
    })
  })
  .existenceCheck('query', {
    invoiceId: 'melvinchia3636$invoice_maker__invoices'
  })
  .callback(async ({ pb, query: { invoiceId } }) =>
    pb.getFullList
      .collection('melvinchia3636$invoice_maker__items')
      .filter([{ field: 'invoice', operator: '=', value: invoiceId }])
      .sort(['order'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new line item')
  .input({
    body: SCHEMAS.melvinchia3636$invoice_maker.items.schema
  })
  .existenceCheck('body', {
    invoice: 'melvinchia3636$invoice_maker__invoices'
  })
  .statusCode(201)
  .callback(async ({ pb, body }) =>
    pb.create
      .collection('melvinchia3636$invoice_maker__items')
      .data(body)
      .execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing line item')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.melvinchia3636$invoice_maker.items.schema.partial()
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__items'
  })
  .callback(async ({ pb, query: { id }, body }) =>
    pb.update
      .collection('melvinchia3636$invoice_maker__items')
      .id(id)
      .data(body)
      .execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a line item')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__items'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('melvinchia3636$invoice_maker__items').id(id).execute()
  )

const reorder = forgeController
  .mutation()
  .description('Reorder line items')
  .input({
    body: z.object({
      invoiceId: z.string(),
      itemIds: z.array(z.string())
    })
  })
  .existenceCheck('body', {
    invoiceId: 'melvinchia3636$invoice_maker__invoices'
  })
  .callback(async ({ pb, body: { itemIds } }) => {
    // Update each item's order based on its position in the array
    const updates = itemIds.map((id, index) =>
      pb.update
        .collection('melvinchia3636$invoice_maker__items')
        .id(id)
        .data({ order: index })
        .execute()
    )

    await Promise.all(updates)

    return { success: true }
  })

export default forgeRouter({ listByInvoice, create, update, remove, reorder })
